import Game from './Game.js';
import SpeedRate from './SpeedRate.js';
import Creature from "./Card.js";

// Отвечает является ли карта уткой.
function isDuck(card) {
    return card instanceof Duck || (card instanceof PseudoDuck);
    //return card && card.quacks && card.swims;
}

// Отвечает является ли карта собакой.
function isDog(card) {
    return card instanceof Dog;
}

// Дает описание существа по схожести с утками и собаками
export function getCreatureDescription(card) {
    if (isDuck(card) && isDog(card)) {
        return 'Утка-Собака';
    }
    if (isDuck(card)) {
        return 'Утка';
    }
    if (isDog(card)) {
        return 'Собака';
    }
    return 'Существо';
}

class Duck extends Creature {
    constructor(name = 'Мирная утка', maxPower = 2, image = null) {
        super(name, maxPower, image);
    }

    quacks() {
        console.log('quack');
    }

    swims() {
        console.log('float: both;');
    }
}

// Колода Шерифа, нижнего игрока.
const seriffStartDeck = [
    new Duck('Мирный житель', 2),
    new Duck('Мирный житель', 2),
    new Duck('Мирный житель', 2),
];

// Колода Бандита, верхнего игрока.
const banditStartDeck = [
    new Dog('Бандит', 3),
];


// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});

class Dog extends Creature {
    constructor(name = 'Пес-бандит', maxPower = 3, image = null) {
        super(name, maxPower, image);
    }
}

class Gatling extends Creature {
    constructor(name = 'Гатлинг', maxPower = 6, image = null) {
        super(name, maxPower, image);
    }

    attack(gameContext, continuation) {
        const taskQueue = new TaskQueue();
        gameContext.oppositePlayer.table.forEach((card, index) => {
            taskQueue.push(onDone => {
                this.view.showAttack(onDone);
            });
            taskQueue.push(onDone => {
                if (card) { 
                    this.dealDamageToCreature(2, card, gameContext, onDone);
                } else {
                    onDone();
                }
            });
        });

        taskQueue.push(onDone => {
            continuation();
        });

        taskQueue.continueWith(continuation);
    }
}
    


class Trasher extends Dog {
    constructor(name = 'Громила', maxPower = 5, image = null) {
        super(name, maxPower, image);
    }

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        this.view.signalAbility(() => {continuation(Math.max(value - 1, 0))});
    }

    getDescriptions() {
        return [
            'если Громилу атакуют, то он получает на 1 меньше урона',
            ...super.getDescriptions()
        ];
    }
}

class PseudoDuck extends Dog {
    constructor(name = 'Псевдоутка', maxPower = 3, image = null) {
        super(name, maxPower, image);
    }

    quacks() {
        console.log('quack');
    }

    swims() {
        console.log('float: both;');
    }
}

/*class Rogue extends Creature {
    constructor(name = 'Изгой', maxPower = 2, image = null) {
        super(name, maxPower, image);
    }

    doBeforeAttack(gameContext, onDone) {
        const arr = ['modifyDealedDamageToCreature', 'modifyDealedDamageToPlayer', 'modifyTakenDamage'];
        const roguePrototype = Object.getPrototypeOf(this);
        gameContext.oppositePlayer.table.forEach(card => {
            if (card && Object.getPrototypeOf(card) === roguePrototype) {
        arr.forEach(x => {

        })
    }
}
*/
