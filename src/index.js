const RegEx = {
  EXTRACT_PROPS: /\$(?:(\w+)\.)?(\w+)\s*=\s*("[^"]+"|'[^']+'|\b\w+\b|\d+)/,
  EXTRACT_CONDITION: /\?\((?:(\w+)\.)?(\w+)\s*(==|<|>)\s*["']?([^"'\s]+)["']?\)/,
  EXTRACT_EMOTION: /\{\{([\w, +]+)\}\}/,
  IS_LINK: /^!*\[\[.+?\]\]!*$/g,
  DOUBLE_SQUARE_BRACKETS: /^!*\[\[|\]\]!*$/g,
}

class Parser {
  twstory;

  constructor(twstory) {
    this.twstory = twstory;
    this.convertPassage = this.convertPassage.bind(this);
  }

  toJSON() {
    console.log("Converting to Story //");
    const { name, startnode: startNodeId } = this.attrsToObject(this.twstory.attributes)
    const passagesNodes = this.twstory.getElementsByTagName("tw-passagedata");
    const convertedPassages = [...passagesNodes].map(this.convertPassage);
    const startNode = convertedPassages.find((passage) =>
      passage.pid == startNodeId
    )

    const passages = {}
    convertedPassages.forEach((row) => {
      passages[row.name] = { ...row, name: undefined, pid: undefined };
    });

    return {
      name,
      passages,
      startNode: startNode.name,
    };
  }

  convertPassage(passage) {
    const converted = passage.innerHTML.split("\n")
      .map(line => this.decodeHtmlEntities(line).trim())
      .filter(Boolean)
      .reduce((acc, lineRaw) => {

        // Props are expected to be on a line by themselves
        const propsMatch = lineRaw.match(RegEx.EXTRACT_PROPS);
        if (propsMatch) {
          acc.props = this.getProp(propsMatch, acc.props)
          return acc;
        }

        const entry = {}
        let workingLine = lineRaw;

        // Dialogue and Response lines may have conditional and emotions
        // conditional and emotions must be at the start of the line
        const condition = this.getCondition(workingLine);
        if (condition) entry.condition = condition;
        workingLine = workingLine.replace(RegEx.EXTRACT_CONDITION, "");

        const emotions = workingLine.match(RegEx.EXTRACT_EMOTION);
        if (emotions) entry.emotions = emotions[1].split(',').map(t => t.trim()).filter(Boolean);
        workingLine = workingLine.replace(RegEx.EXTRACT_EMOTION, "");

        const linkMatch = workingLine.match(RegEx.IS_LINK);
        if (linkMatch) {
          const linkContent = workingLine.replace(RegEx.DOUBLE_SQUARE_BRACKETS, "").split("|");
          if (linkContent && linkContent.length == 1) {
            entry.text = null;
            entry.link = linkContent[0];
            acc.redirects.push(entry);
            return acc;
          }
          if (linkContent && linkContent.length == 2) {
            const [text, link] = linkContent;
            entry.text = linkContent[0];
            entry.link = linkContent[1];
            acc.responses.push(entry);
            return acc;
          }
          // invalid, skip
          return acc;
        }

        entry.text = workingLine;
        acc.lines.push(entry);
        return acc;
      }, {
        lines: [],
        responses: [],
        redirects: [],
        props: {}
      })

    const { name, pid, tags } = this.attrsToObject(passage.attributes)
    return {
      ...linesConverted,
      tags: tags.split(" ").filter(Boolean),
      name,
      pid,
    }
  }

  getProp(matchResult, props) {
    const [_fullMatch, groupName, propName, value] = matchResult;

    let typedValue
    try {
      typedValue = JSON.parse(value);
    } catch (error) {
      typedValue = value;
    }

    if (groupName) {
      props[groupName] = props[groupName] || {};
      props[groupName][propName] = typedValue;
    }
    else {
      props[propName] = typedValue;
    }
    return props;
  }

  getCondition(text) {
    const match = text.match(RegEx.EXTRACT_CONDITION);
    if (!match) return null;

    let [_, group, prop, comparator, value] = match;

    switch (comparator) {
      case "==": comparator = "eq"; break;
      case ">": comparator = "gt"; break;
      case "<": comparator = "lt"; break;
      case ">=": comparator = "gte"; break;
      case "<=": comparator = "lte"; break;
    }

    try {
      value = JSON.parse(value);
    } catch (error) {}

    return { group, prop, comparator, value };
  }

  toLuaTableString() {

    const parseLua = (value) => {
      if (value === null) return null;

      if (Array.isArray(value)) {
        const elements = value.map(parseLua).join(", ");
        return `{${elements}}`;
      }

      const valueType = typeof value;

      if (valueType == "number" || valueType == "number")
        return value.toString();

      if (valueType == "string")
        return JSON.stringify(value);

      if (valueType == "object") {
        const properties = Object.entries(value)
          .map(([key, val]) => `${key} = ${parseLua(val)}`)
          .join(", ");
        return `{${properties}}`;
      }

      throw new Error(`Unsupported data type: ${valueType}`);
    };

    const data = this.toJSON();
    return `return ${parseLua(data)}`;
  }

  attrsToObject(node) {
    return Object
      .entries(node)
      .reduce((acc, [key, value]) => ({
        ...acc,
        [value.name]: value.value
      }), {})
  }

  decodeHTMLEntities(text) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }
}

const parseTwineToLua = () => {
  const twStorydata = document.getElementsByTagName("tw-storydata")[0];
  const parser = new Parser(twStorydata);
  document.getElementById("output").innerHTML = parser.toLuaTableString()
};

window.parseTwineToLua = parseTwineToLua;
