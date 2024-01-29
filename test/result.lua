return {
    passages = {
        tutorial_100 = {
            responses = {
                {link = 'tutorial_102', text = 'Why should I answer you?'},
                {link = 'tutorial_101', text = "I'm not sure"},
                {link = 'youre_stupid', text = 'Youre stupid!'}
            },
            props = {tutorial = 1},
            lines = {
                {text = 'HALT!'},
                {text = ' Oh, you are 5 years old?', condition = {varName = 'age', comparator = 'eq', value = '5'}},
                {text = '...'},
                {text = 'Okay, I think youre good to go, but why are you here?'}
            }
        },
        Greeting = {lines = {{text = 'Hey'}, {text = 'What do you want?'}}},
        tutorial_200 = {
            redirects = {{link = 'tutorial_300', isEnd = true}},
            props = {highlight = 'tutorial_2'},
            lines = {
                {text = 'Your staff just got some magic in it'},
                {text = 'Try using it to fix this pillar over here.'}
            }
        },
        tutorial_101 = {
            responses = {{link = 'tutorial_110', text = 'Do you need any help?'}},
            lines = {{text = 'Not sure eh?'}, {text = 'Okay...'}}
        },
        tutorial_102 = {
            responses = {{link = 'tutorial_110', text = 'Do you need any help?'}},
            lines = {
                {
                    text = "This castle is important to me, I'm not just going to let some nobody enter without explaining themselves"
                }
            }
        },
        tutorial_110 = {
            responses = {
                {link = 'tutorial_120', text = 'Who am I talking to?'},
                {link = 'tutorial_150', text = 'Sure, but actually... how do i do that?'}
            },
            lines = {
                {text = '?'},
                {text = 'Well, actually, yeah'},
                {text = 'I can see your staff, so youre a wizzard...'},
                {text = 'Do you mind cleaning this place up a little bit?'}
            }
        },
        tutorial_150 = {
            responses = {{link = 'tutorial_200', text = 'Okay', isEnd = true}},
            props = {highlight = 'fountain'},
            lines = {{text = 'Hmm, okay...'}, {text = 'For now just go onto the fountain'}}
        },
        tutorial_300 = {
            responses = {{link = 'tutorial_310', text = 'How did I do that?'}},
            lines = {{text = 'That was pretty good'}}
        },
        tutorial_310 = {
            responses = {{link = 'tutorial_320', text = 'Okay, thanks! Bye'}},
            lines = {
                {text = 'Well'},
                {text = 'Your staff collected our EP (Ectoplasm)'},
                {text = 'You can use the staff to do various spells'}
            }
        },
        tutorial_120 = {
            responses = {
                {link = 'tutorial_150', text = 'How do I "clean up"?'},
                {link = 'tutorial_130', text = 'How can I trust you if I dont know who you are?'}
            },
            props = {shakeCamera = 'true'},
            lines = {{text = 'That doesnt matter right now'}}
        },
        tutorial_130 = {
            responses = {{link = 'tutorial_150', text = 'Okay, sorry. How do I "clean up" as you said?'}},
            props = {shakeCamera = 'false'},
            lines = {
                {text = 'Ugh'},
                {text = "I'm a ghost"},
                {text = 'I used to live here'},
                {text = 'Well...'},
                {text = 'I used to protect this area...'},
                {text = "I'm the main butler around here"}
            }
        },
        tutorial_320 = {lines = {{text = 'Bye'}}},
        youre_stupid = {
            responses = {
                {link = 'default_response', text = 'Oh, sorry about that'},
                {
                    condition = {varName = 'age', comparator = 'lt', value = 50},
                    link = 'optional_response',
                    text = 'An optional response'
                }
            },
            redirects = {
                {condition = {varName = 'age', comparator = 'gt', value = 50}, link = 'redirect_after_text_number'},
                {condition = {varName = 'hat', comparator = 'eq', value = 'redirect'}, link = 'redirect_after_text'},
                {
                    condition = {varName = 'hat', comparator = 'eq', value = 'urgent'},
                    link = 'urgent_redirect',
                    isUrgent = true
                }
            },
            lines = {{text = 'Thats rude...'}}
        },
        urgent_redirect = {lines = {{text = 'Urgent Redirect!'}}},
        redirect_after_text = {lines = {{text = 'Redirect after text'}}},
        redirect_after_text_number = {lines = {{text = 'Redirect after the text (with number)'}}},
        optional_response = {lines = {{text = 'Optional Response'}}},
        default_response = {lines = {{text = 'This is the default response'}}}
    },
    name = 'Maxwell',
    start_node_name = 'tutorial_100'
}
