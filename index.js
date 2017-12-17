/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
'use strict';

const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.773877bf-f9e1-496e-8212-47e2ae14257f';

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Alexa Calendar Manager',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, when\'s the next meeting?... or schedule a room ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Meeting for %s.',
            HELP_MESSAGE: "You can ask questions such as, when\'s the next meeting?... or schedule a room ...Now, what can I help you with?",
            HELP_REPROMPT: "You can say things like, when\'s the next meeting?... or schedule a room ...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            SCHEDULE: 'You want to schedule %s',
            SCHEDULE_REPEAT_MESSAGE: 'Try saying repeat.',
            SCHEDULE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently can\'t access the server.",
            SCHEDULE_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'en-US': {
        translation: {
            SKILL_NAME: 'Alexa Calendar Manager',
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'scheduleRoom': function () {

        const intentObj = this.event.request.intent;

        if (this.event.request.dialogState === 'STARTED') {
            if (intentObj.slots.start.confirmationStatus !== 'CONFIRMED') {
                if (intentObj.slots.start.confirmationStatus !== 'DENIED') {
                    // Slot is not confirmed
                    const slotToConfirm = 'start';
                    const speechOutput = 'You want to start the meeting at ' + intentObj.slots.start.value + ', right?';
                    const repromptSpeech = speechOutput;
                    this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
                } else {
                    // User denies the confirmation of the slot value
                    const slotToElicit = 'start';
                    const speechOutput = 'Okay, when do you want to start?';
                    this.emit('elicitSlot', slotToElicit, speechOutput, speechOutput);
                }
            } else if (intentObj.slots.end.confirmationStatus !== 'CONFIRMED') {
                if (intentObj.slots.end.confirmationStatus !== 'DENIED') {
                    const slotToConfirm = 'end';
                    const speechOutput = 'You want to end the meeting at ' + intentObj.slots.end.value + ', right?';
                    const repromptSpeech = speechOutput;
                    this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
                } else {
                    const slotToElicit = 'end';
                    const speechOutput = 'Okay, when do you want to end the meeting?';
                    this.emit(':elicitSlot', slotToElicit, speechOutput, speechOutput);
                }
            } else if (intentObj.slots.responsible.confirmationStatus !== 'CONFIRMED') {
                if (intentObj.slots.responsible.confirmationStatus !== 'DENIED') {
                    const slotToConfirm = 'responsible';
                    const speechOutput = 'You want schedule the room for ' + intentObj.slots.responsible.value + ', right?';
                    const repromptSpeech = speechOutput;
                    this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech)
                } else {
                    const slotToElicit = 'responsible';
                    const speechOutput = 'Okay, who is the responsible for the meeting?';
                    this.emit(':elicitSlot', slotToElicit, speechOutput, speechOutput);
                }
            } else {
                // handleScheduleRoomIntentAllSlotsAreConfirmed();
                this.speak('Your meeating is at ' +
                    intentObj.slots.start.value + ' to ' +
                    intentObj.slots.end.value + ' for ' +
                    intentObj.slots.responsible.value);
            }
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
