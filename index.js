// подключаем Dotenv.
require('dotenv').config();
process.env.NTBA_FIX_319 = 1
const TelegramAPI = require('node-telegram-bot-api') // фреймворк для работы с API Telegram
const keyboard =  require ('./module/keyboard')
const messageText =  require ('./module/text.js')


const express = require('express');
const app = express();
app.listen(80)


const mongoose = require('mongoose') // база данных MongoDB
const User = require('./models/users') // экспорт модель базы данных


let NameButton = 'Кнопка'
let LinkButton = 'https://t.me/DakoUps'

const bot = new TelegramAPI(process.env.KEY, { polling: true})
const adm = new TelegramAPI(process.env.KEY2, { polling: true})

// вспомогательная переменная для отправка фотографий.
let iComm = 0;

// подключение к базе данных, в случае ошибки выводим в консоль.
mongoose
    .connect(process.env.TOKENBD, {useNewUrlParser: true, useUnifiedTopology: true}) 
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
        .then(res => console.log('User added'))
        .catch(err => console.log('Error! Can not create user!!\n'+err))

    bot.sendPhoto(ChatId, './src/start.jpg', {
        caption: `Добро пожаловать! ${UserName}
\n⚙️ <strong>Уникальный механизм, разработанный на личном годовом опыте</strong>, с самыми удобными индикаторами, которые обеспечивают лучшие сигналы на СНГ рынке.
\nПросто представь себе, ты будешь зарабатывать столько, сколько даже не мечтал 💰
\nПрежде, чем Вы попадёте в VIP, обязательно подпишитесь на <a href="https://t.me/+qkRUSkRNSt82NzBi">наш канал</a> где есть много информации.
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

adm.onText(/\/postphoto/, async msg => {

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

adm.onText(/\/postvideo/, async msg => {

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

adm.onText(/\/posttext/, async msg => {
    
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

adm.onText(/\/namebutton/, async msg => {
    NameButton = msg.text.split(" ").slice(1,2).join(" ");
    
    const ChatId = msg.chat.id;

    adm.sendMessage(ChatId, `name button: ${NameButton}`, {
        parse_mode: 'HTML',
    })
    
})

adm.onText(/\/linkbutton/, async msg => {
    LinkButton = msg.text.split(" ").slice(1,2).join(" ");

    const ChatId = msg.chat.id;

    adm.sendMessage(ChatId, `link button: ${LinkButton}`, {
        parse_mode: 'HTML',
    })
})

adm.onText(/\/nbtnposttext/, async msg => {
    
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

adm.onText(/\/nbtnpostphoto/, async msg => {

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


adm.onText(/\/users/, async msg => {
    const ChatId = msg.chat.id;
    const log = await User.find( { }, { UserName: 1, _id: 0 } );

    adm.sendMessage(ChatId, `name button: ${NameButton}`, {
        parse_mode: 'HTML',
    })
    adm.sendMessage(ChatId, `\nВсего: ${log.length} пользователей.`, {
        parse_mode: 'HTML',
    })
})
