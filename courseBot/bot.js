const express = require("express");
const { Telegraf } = require("telegraf");
const NodeGeocoder = require("node-geocoder");
const { readJSONFile } = require('./src/helper/file.helper');
const {path, join} = require('path')

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
});

const app = express();
const bot = new Telegraf("6328900544:AAGUthJIp4ExphJnNibxP5Tokm_VIQ2KB_I");

const teachers = readJSONFile("src/model/teachers.json");
const courses = readJSONFile("src/model/courses.json");
const branches = readJSONFile("src/model/branches.json");

function filterTeachersByBranchId(branchId) {
  return teachers.filter((teacher) => teacher.branchId === branchId);
}

function filterCoursesByBranchId(branchId) {
  return courses.filter((course) => {
    const teacher = teachers.find((teacher) => teacher.id === course.teacherId);
    return teacher && teacher.branchId === branchId;
  });
}

app.use(express.json());

bot.start((ctx) => {
  ctx.reply(
    "Добро пожаловать в учебный центр по программированию! Выберите действие:",
    {
      reply_markup: {
        keyboard: [
          ["💁 О нас", "🏢 Главный офис"],
          ["🗺️ Филиалы", "📚 Каталог курсов"],
          ["👥 Учителя", "📜 Правила обучения"],
          ["📍 Ближайщие филиалы"],
        ],
      },
    }
  );
});

bot.hears("💁 О нас", (ctx) => {
  const message = `Учебный центр по программированию - это место, где вы можете освоить различные программистские навыки и стать экспертом в своей области. Мы предлагаем широкий спектр курсов, проводимых опытными преподавателями. Присоединяйтесь к нам и начните свой путь к успеху в IT-индустрии!`;
  ctx.reply(message);
});

bot.hears("🏢 Главный офис", (ctx) => {
  const message = `Наш главный офис расположен по адресу: ул. Примерная, 123, Город. Мы всегда рады приветствовать вас в нашем офисе и ответить на все ваши вопросы. Ждем вас!`;
  ctx.reply(message);
});

bot.hears("🗺️ Филиалы", (ctx) => {
  let message = `У нас есть несколько филиалов, где вы можете пройти обучение. \n Вот список наших филиалов: \n
`;
  branches.forEach((branch) => {
    message += `📍 ${branch.title}\n`;
    message += `   📞 Телефон: ${branch.phone}\n`;
    message += `   📧 Email: ${branch.email}\n`;
    message += `   🗺️ Адрес: ${branch.address}\n\n`;
  });
  ctx.reply(message);
});

bot.hears("📚 Каталог курсов", (ctx) => {
  const branchId = ctx.session?.branchId;
  let filteredCourses = courses;

  if (branchId) {
    filteredCourses = filterCoursesByBranchId(branchId);
  }

  const buttonsPerRow = 2;
  let inlineKeyboard = [];
  let row = [];

  filteredCourses.forEach((course, index) => {
    row.push({
      text: course.shortTitle,
      callback_data: `course:${index}`, 
    });

    if ((index + 1) % buttonsPerRow === 0 || index === filteredCourses.length - 1) {
      inlineKeyboard.push(row);
      row = [];
    }
  });

  let courseNum = 0
  let message = "Список доступных курсов:\n\n";
  filteredCourses.forEach((course) => {
      courseNum++
      message += `${courseNum}. ${course.title}\n\n`;
  })
  ctx.reply(message, {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });
});

bot.action(/^course:(\d+)$/, (ctx) => {
  const match = ctx.match;
  const courseId = match[1];
  let filteredCourses = courses;

  const course = filteredCourses[courseId];

  const teacher = teachers.find((teacher) => teacher.id === course.teacherId);

  const message = `
    📌 Название курса: ${course.title} \n💰 Цена: ${course.price} USD \n🗣️ Языки программирования: ${course.languages.join(', ')} \n📝 Описание: \n ${course.description} \n\n 👨‍🏫 Преподаватель: ${teacher.name}
  `;

  ctx.replyWithPhoto({ source: course.image }, {
    caption: message,
    reply_markup:{
      inline_keyboard:[
          [{text:"Выбрать этот курс", callback_data:"get course"}]
      ]
    }
  });
});

bot.on('get course', (ctx) => {
  answerCbQuery(`Ваш запрос принят !`);
})

bot.hears("👥 Учителя", (ctx) => {
  let message = "Список наших преподавателей:\n\n";
  teachers.forEach((teacher) => {
    message += `👨‍🏫 Имя: ${teacher.name}\n`;
    message += `   👥 Филиал: ${teacher.branchId}\n\n`;
  });
  ctx.reply(message);
});

bot.hears("📜 Правила обучения", (ctx) => {
  const message = `Правила обучения в нашем учебном центре:

1. Будьте внимательны и дисциплинированы во время занятий.
2. Следуйте указаниям преподавателя и соблюдайте установленный распорядок дня.
3. Приносите необходимые материалы и оборудование на занятия.
4. Уважайте права и мнения других студентов.
5. Соблюдайте правила конфиденциальности и безопасности данных.
6. Запрещено использование недобросовестных методов или плагиата в выполнении заданий.
7. Если у вас возникли вопросы или проблемы, обратитесь к администрации.

Благодарим вас за соблюдение этих правил и желаем успешного обучения!`;
  ctx.reply(message);
});

bot.hears("📍 Ближайщие филиалы", (ctx) => {
  ctx.reply("Отправьте локацию, пожалуйста.");
});

bot.on("location", async (ctx) => {
  const { latitude, longitude } = ctx.message.location;

  try {
    const res = await geocoder.reverse({ lat: latitude, lon: longitude });

    if (res && res.length > 0) {
      const city = res[0].city;
      const branchesNear = branches.filter((branch) => branch.city === city);
      let message = "Ближайщие филиалы:";
      branchesNear.forEach((branch) => {
        message += `\n ${branch.title}`;
      });
      ctx.reply(message);
    } else {
      ctx.reply("Не удалось определить город для указанных координат.");
    }
  } catch (error) {
    console.error("Ошибка обратного геокодирования:", error);
    ctx.reply("Произошла ошибка при определении города.");
  }
});

bot.use((ctx, next) => {
  if (ctx.update?.message?.location) {
    bot.emit("location", ctx);
  }
  return next();
});

app.listen(3000, () => {
  console.log("Сервер запущен на порту 3000");
});

bot.launch();
