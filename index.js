 // подключаем Dotenv.
require('dotenv').config();
const TelegramAPI = require('node-telegram-bot-api') // фреймворк для работы с API Telegram
const keyboard =  require ('./module/keyboard')
const messageText =  require ('./module/text.js')


console.log('------ СКРИПТ ЗАПУЩЕН ------')

const mongoose = require('mongoose') // база данных MongoDB
const User = require('./models/users') // экспорт модель базы данных


// дрес сервера, на котором хостится бот
const SERVER_URL = `${process.env.SERVER_URL}`
const BOT_TOKEN = `${process.env.BOT_TOKEN}`
const DB_TOKEN = `${process.env.DB_TOKEN}`
const PORT = process.env.PORT || 3000


// бот для пользователей + привязка вебхука
const bot = new TelegramAPI(BOT_TOKEN, { polling: true }) //, webHook: {port: PORT}
// bot.setWebHook()
// bot.setWebHook(`${SERVER_URL}/webhook/${BOT_TOKEN}`)


// вспомогательная переменная для отправка фотографий.
let iComm = 0;

// переменные для хранения инфо о рассылке
let NameButton = 'Кнопка'
let LinkButton = 'https://t.me/Dakos777'

// подключение к базе данных, в случае ошибки выводим в консоль.
mongoose
    .connect(DB_TOKEN, {useNewUrlParser: true, useUnifiedTopology: true}) 
    .then((res) => console.log('Success! DB connected'))  // успех.
    .catch( err => console.log(err)); // ошибка.


// Обработка команды start
// а также сбор информации и отправка в базу данных
bot.onText(/\/start/, msg => {
    // переменная для хранение айдишника чата.
    const ChatId = msg.chat.id;
    // переменная для хранение имени пользователя.
    const UserName = msg.from.first_name;


    // создаем модель пользователя и сохраняем в базу данных.
    const users = new User({ChatId, UserName});
    users
        .save()
        .then(res => console.log(`User ${UserName} added`))
        .catch(err => console.log(`Error! Can not create user ${UserName}!!\n`+err))

    bot.sendPhoto(ChatId, './src/start.jpg', {
        caption: `Добро пожаловать, <u>${UserName}</u>!
\n⚙️ Здесь вы можете получить <strong>информацию по входу в VIP-канал</strong>, так же вы можете посмотреть <strong>отзывы людей и работу самих сигналов.</strong>
\n☑️ <strong>Пройдите инструкцию и получите доступ в VIP канал</strong>.
\n🔊 Также обязательно подпишитесь на <a href="https://t.me/+qkRUSkRNSt82NzBi">наш канал</a>, где есть много полезной информации 
\n<strong>И только после этого Вы сможете получать сигналы!</strong>`, 
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: keyboard.start
        }
    }) 
})


// отслеживаем нажатие клавиатуры
// исходя за значением data, будем выбирать что и отправлять

bot.on('callback_query', query => {
    bot.answerCallbackQuery(query.id);

    const ChatId = query.message.chat.id;
    const messageId = query.message.message_id;
    
    switch(query.data){
        case 'second': 
            bot.sendVideo(ChatId, './src/second.MP4', {
                caption: messageText.second,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: keyboard.second
                }
            })
            break
        

        case 'join':
            bot.sendPhoto(ChatId, './src/join.jpg', {
                caption: messageText.join,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: keyboard.join
                }
            })
            break


        case 'account_created':        
            bot.sendPhoto(ChatId, './src/created.jpg', {
                caption: messageText.account_created,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: keyboard.acc_created
                }
            })
            break

        case 'have_account':
            bot.sendPhoto(ChatId, './src/haveacc.jpg', {
                caption: messageText.have_account, 
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: keyboard.have_acc
                }
            })
            break


        case 'comment':
            bot.sendPhoto(ChatId, `./src/comm${iComm}.PNG`, {
                caption: messageText.comment,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: keyboard.comment
                }
            })

            // если перменная хранит число 12, то мы присваиваем ему ноль, иначе добавляем единицу.
            iComm != 11 ? iComm++ : iComm = 0;
            break
    }
})

// принимаем команду, обрабатываем текст и ссылку на фотографию
// затем собираем список юзеров с базы данных и отправляем сообщение

bot.onText(/\/ADMINpostphoto/, async msg => {
    if (msg.from.username !== "yumme1" && msg.from.username !== "stascsa"){
        return
    }

    // переменная для хранение текста, который мы будем отправлять.
    const sendText = msg.text.split(" ").slice(2).join(" "); 

    //перменная для хранение ссылки фотографии.
    const sendUrl = msg.text.split(" ").slice(1,2).join(" ");

    const log = await User.find( { }, { ChatId: 1, _id: 0 } );
    
    // проходим циклом по всем юзерам
    for (let i = 0; i < log.length; i++) {
        
        bot.sendPhoto(log[i].ChatId, sendUrl, {
            caption: sendText,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: NameButton,
                            callback_data: '1',  
                            url: LinkButton
                        }
                    ],
                ],
            }
        })
                
    }

})


// принимаем команду, обрабатываем текст и ссылку на видео
// затем собираем список юзеров с базы данных и отправляем сообщение

bot.onText(/\/ADMINpostvideo/, async msg => {
    if (msg.from.username !== "yumme1" && msg.from.username !== "stascsa"){
        return
    }

    // переменная для хранение текста, который мы будем отправлять.
    const sendText = msg.text.split(" ").slice(2).join(" "); 

    //перменная для хранение ссылки видео.
    const sendUrl = msg.text.split(" ").slice(1,2).join(" ");

    const log = await User.find( { }, { ChatId: 1, _id: 0 } );
    
    // проходим циклом по всем юзерам
    for (let i = 0; i < log.length; i++) {
        
        bot.sendVideo(log[i].ChatId, sendUrl, {
            caption: sendText,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: NameButton,
                            callback_data: '1',  
                            url: LinkButton
                        }
                    ],
                ],
            }
        })
                
    }

})


// принимаем команду, затем обрабатываем только текст
// затем собираем список юзеров с базы данных и отправляем сообщение

bot.onText(/\/ADMINposttext/, async msg => {
    if (msg.from.username !== "yumme1" && msg.from.username !== "stascsa"){
        return
    }

    // переменная для хранение текста, который мы будем отправлять.
    const sendText = msg.text.split(" ").slice(1).join(" ");

    const log = await User.find( { }, { ChatId: 1, _id: 0 } );
    
    // проходим циклом по всем юзерам
    for (let i = 0; i < log.length; i++) {
        
        bot.sendMessage(log[i].ChatId, sendText, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: NameButton,
                            callback_data: '1',  
                            url: LinkButton
                        }
                    ],
                ],
            }
        })
                
    }

})

bot.onText(/\/ADMINnamebutton/, async msg => {
    if (msg.from.username !== "yumme1" && msg.from.username !== "stascsa"){
        return
    }

    NameButton = msg.text.split(" ").slice(1,2).join(" ");
    
    const ChatId = msg.chat.id;

    bot.sendMessage(ChatId, `name button: ${NameButton}`, {
        parse_mode: 'HTML',
    })
    
})

bot.onText(/\/ADMINlinkbutton/, async msg => {
    if (msg.from.username !== "yumme1" && msg.from.username !== "stascsa"){
        return
    }
    LinkButton = msg.text.split(" ").slice(1,2).join(" ");

    const ChatId = msg.chat.id;

    bot.sendMessage(ChatId, `link button: ${LinkButton}`, {
        parse_mode: 'HTML',
    })
})


bot.onText(/\/ADMINnbtnposttext/, async msg => {
    if (msg.from.username !== "yumme1" && msg.from.username !== "stascsa"){
        return
    }
    // переменная для хранение текста, который мы будем отправлять.
    const sendText = msg.text.split(" ").slice(1).join(" ");

    const log = await User.find( { }, { ChatId: 1, _id: 0 } );
    
    // проходим циклом по всем юзерам
    for (let i = 0; i < log.length; i++) {
        
        bot.sendMessage(log[i].ChatId, sendText, {
            parse_mode: 'HTML',
            
        })         
    }
})

bot.onText(/\/ADMINnbtnpostphoto/, async msg => {
    if (msg.from.username !== "yumme1" && msg.from.username !== "stascsa"){
        return
    }
    // переменная для хранение текста, который мы будем отправлять.
    const sendText = msg.text.split(" ").slice(2).join(" "); 

    //перменная для хранение ссылки фотографии.
    const sendUrl = msg.text.split(" ").slice(1,2).join(" ");

    const log = await User.find( { }, { ChatId: 1, _id: 0 } );
    
    // проходим циклом по всем юзерам
    for (let i = 0; i < log.length; i++) {      
        bot.sendPhoto(log[i].ChatId, sendUrl, {
            caption: sendText,
            parse_mode: 'HTML',
        })        
    }
})


bot.onText(/\/ADMINusers/, async msg => {
    if (msg.from.username !== "yumme1" && msg.from.username !== "stascsa"){
        return
    }
    
    console.log('да')

    const ChatId = msg.chat.id;
    const log = await User.find( { }, { ChatId: 1, _id: 0 } );

    bot.sendMessage(ChatId, `Ботом воспользовались ${log.length} человек.`, {
        parse_mode: 'HTML'
    })
})


const express = require("express");
// const axios = require('axios');
const app = express()

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
  console.log('Bot is ok!')
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

