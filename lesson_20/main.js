const express = require("express");
const { Telegraf } = require("telegraf");
const { Markup } = require("telegraf");
require("dotenv").config();

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command("start", (ctx) => {
  ctx.replyWithPhoto(
    { source: "./src/images/profile.png" },
    {
      caption:
        "Step into my digital realm! \n\n I'm Kolya, a passionate Junior Full Stack Programmer with a knack for crafting extraordinary web experiences. \n From elegantly designed user interfaces to robust backend systems, I bring together art and technology to create stunning and functional applications. \n\n Let's embark on a coding adventure together and build something exceptional!",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "About me", callback_data: "about" },
            { text: "Portfolio", callback_data: "portfolio" },
          ],
        ],
      },
    }
  );
});

const handleAbout = (ctx) => {
  ctx.replyWithPhoto(
    { source: "./src/images/about.png" },
    {
      caption:
        "Welcome to my world of coding and creativity! \n\n I am Kolya, a passionate Junior Full Stack Programmer with a love for crafting digital experiences. With a year of dedicated learning under my belt, including 3 months focused on backend development and 9 months honing my frontend skills, I'm ready to bring your ideas to life. \n\n I believe in the power of technology to transform the way we live, work, and connect with one another. My journey as a programmer has allowed me to dive deep into the realms of JavaScript, React, and Node.js, mastering the art of crafting interactive and seamless web applications. From designing intuitive user interfaces to architecting efficient server-side solutions, I'm here to make your digital dreams a reality.",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "GitHub", url: "https://github.com/hikikoi" },
            { text: "Write to me", url: "https://t.me/qutbiddin_safarov" },
          ],
          [{ text: "Resume", url: "https://hikikoi-resume.netlify.app/" }],
          [{ text: "Portfolio", callback_data: "portfolio" }],
        ],
      },
    }
  );
};

const handlePortfolio = async (ctx) => {
  await ctx.replyWithPhoto(
    { source: "./src/images/portfolio.png" },
    {
      caption: "Here you can explore my portfolio. \n\nPlease note that only two projects are showcased here, while you can find more on my portfolio page.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Portfolio page", url: "https://hikikoi-portfolio.netlify.app/" }],
          [
            { text: "About me", callback_data: "about" }
          ],
          [
            { text: "Starbucks", callback_data: "project1" },
            { text: "WORLD.", callback_data: "project2" },
          ],
        ],
      },
    }
  );
};

// Commands
bot.command("about", handleAbout);
bot.command("portfolio", handlePortfolio);

// Call commands
bot.action("portfolio", handlePortfolio);
bot.action("about", handleAbout);

// Actions
bot.action("project1", (ctx) => {
  ctx.replyWithPhoto(
    { source: "./src/images/starbucks.png" },
    {
      caption: "Languages: HTML, CSS, JS \n Responsive: no \n\n Starbucks web template:",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Code", url: "https://github.com/hikikoi/starbucks-template" },
            { text: "Open in browser", url: "https://starbucks-template.netlify.app/" },
          ],
          [{ text: "Portfolio", callback_data: "portfolio" }]
        ],
      },
    }
  );
});

bot.action("project2", (ctx) => {
  ctx.replyWithPhoto(
    { source: "./src/images/world.png" },
    {
      caption: "Languages: HTML, CSS, JS \n Responsive: yes \n\n Tour agency web template:",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Code", url: "https://github.com/hikikoi/travel-agency" },
            { text: "Open in browser", url: "https://travel-agency-template.netlify.app/" },
          ],
          [{ text: "Portfolio", callback_data: "portfolio" }]
        ],
      },
    }
  );
});

bot.launch();
app.listen(3000, () => {
  console.log("Bot running on port 3000");
});
