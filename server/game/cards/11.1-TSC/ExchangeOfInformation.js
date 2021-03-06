const PlotCard = require('../../plotcard');

class ExchangeOfInformation extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            handler: context => {
                this.remainingCardTypes = ['character', 'location', 'attachment', 'event'];
                this.potentialCards = this.controller.searchDrawDeck(10);
                this.selectedCards = [];
                this.selectingOpponent = context.opponent;
                this.game.addMessage('{0} uses {1} to choose {2} and reveals {3}', this.controller, this, context.opponent, this.potentialCards);
                this.promptForNextCardType();
            }
        });
    }

    promptForNextCardType() {
        if(this.remainingCardTypes.length === 0) {
            this.completeSelection();
            return;
        }

        let nextType = this.remainingCardTypes.shift();
        this.promptForCardType(nextType);
    }

    promptForCardType(cardType) {
        let cards = this.potentialCards.filter(card => card.getType() === cardType);

        if(cards.length === 0) {
            this.promptForNextCardType();
            return;
        }

        let text = ['attachment', 'event'].includes(cardType) ? `an ${cardType}` : `a ${cardType}`;

        this.game.promptWithMenu(this.selectingOpponent, this, {
            activePrompt: {
                menuTitle: `Select ${text} for ${this.controller.name}`,
                buttons: cards.map(card => {
                    return { card: card, mapCard: true, method: 'selectCard' };
                })
            },
            source: this
        });
    }

    selectCard(player, card) {
        this.selectedCards.push(card);
        this.promptForNextCardType();
        return true;
    }

    completeSelection() {
        for(let card of this.selectedCards) {
            this.controller.moveCard(card, 'hand');
        }
        this.controller.shuffleDrawDeck();
        this.game.addMessage('{0} adds the {1} cards chosen by {2} to their hand and shuffles their deck', this.controller, this.selectedCards.length, this.selectingOpponent);
    }
}

ExchangeOfInformation.code = '11020';

module.exports = ExchangeOfInformation;
