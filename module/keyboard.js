const keyboard = {
    start: [
        [
            {
                text: `✅ ПОДПИСАТЬСЯ НА КАНАЛ  ✅`,
                callback_data: 'chat_link',
                url: 'https://t.me/+qkRUSkRNSt82NzBi'
            }
        ],
        [
            {
                text: `💲 НАЧАТЬ ЗАРАБАТЫВАТЬ 💲`,
                callback_data: 'second',
            }
        ],
        [
            {
                text: `🔉 ОТЗЫВЫ ЛЮДЕЙ 🔉`,
                callback_data: 'comment',
            }
        ]
    ],
    second: [
        [
            {
                text: `💲 ПОЛУЧИТЬ СИГНАЛЫ 💲`,
                callback_data: 'join', 
            }
        ],
        [
            {
                text: `🔉 ОТЗЫВЫ ЛЮДЕЙ 🔉`,
                callback_data: 'comment',
            }
        ]
    ],
    comment: [
        [
            {
                text: `🔉 БОЛЬШЕ ОТЗЫВОВ 🔉`,
                callback_data: 'comment',  
            }
        ],
        [
            {
                text: `🔓 ДОСТУП К VIP 🔓`,
                callback_data: 'second',  
            }
        ]
    ],
    join: [
        [
            {
                text: `СОЗДАЛ АККАУНТ ☑️`, // `💹 СОЗДАТЬ АККАУНТ 💹`
                callback_data: 'account_created', 
            }
        ],
        [
            {
                text: `У МЕНЯ ЕСТЬ АККАУНТ ❗️`,
                callback_data: 'have_account',
            }
        ],
    ],
    acc_created: [
        [
            {
                text: `ПРИСЛАТЬ ID ✅`, // `💹 СОЗДАТЬ АККАУНТ 💹`
                callback_data: 'send_id',  
                url: 'https://t.me/DakoUps'
            }
        ],
    ],
    have_acc:[
        [
            {
                text: `РЕГИСТРАЦИЯ 📲`,
                callback_data: 'account_created',
                url: 'https://1wwxnj.top/?open=register',
            }
        ],
        [
            {
                text: `СОЗДАЛ АККАУНТ ☑️`,
                callback_data: 'account_created',  
            }
        ],
    ],
    
}

module.exports = keyboard;