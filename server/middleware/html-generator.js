import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const buildHTML = (url) => {
  return `  <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Boge Group Calendar</title>
            </head>
            <body>
              <div class="googleCalendar">
                <iframe src="https://calendar.google.com/calendar/appointments/schedules/${url}" style="border: 0" width="100%" height="600" frameborder="0"></iframe>
              </div>
              <style>
                * {
                  box-sizing: border-box;
                  padding: 0;
                  margin: 0;
                }

                .googleCalendar {
                width: auto;
                height: 100vh;
                }

              .googleCalendar iframe {
                height: 100%;
                width: 100%;
              }
            </style>
          </body>
        </html>

`;
};

const buildPage = async (username, url, stage) => {
  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  const __dirname = path.dirname(__filename); // get the name of the directory
  const html = buildHTML(url);
  if (
    !fs.existsSync(
      path.join(__dirname, "..", "views", `${username}-${stage}.html`)
    )
  ) {
    await fsPromises.writeFile(
      path.join(__dirname, "..", "views", `${username}-${stage}.html`),
      html
    );
  }
  return;
};

export default buildPage;
