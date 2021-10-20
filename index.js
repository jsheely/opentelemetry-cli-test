const { tracer, shutdown } = require("./logging");
const { SpanStatusCode } = require("@opentelemetry/api");
const { Command } = require("commander");
const { default: got } = require("got/dist/source");

tracer.startActiveSpan("main", async (span) => {
  const program = new Command();
  program
    .command("doWork")
    .description("It is time to do work")
    .addArgument("value")
    .action(doWork);

  process.on("beforeExit", () => {
    shutdown(span);
  });

  program.parse(process.argv);

  async function doWork(value) {
    tracer.startActiveSpan("doWork", async (span) => {
      try {
        span.setAttribute("value", value);
        const body = await got.get("https://randomuser.me/api/").json();
        const {
          results: [
            {
              name: { first, last },
            },
          ],
        } = body;
        const fullName = `${first} ${last}`;
        span.setStatus(SpanStatusCode.OK);
        span.setAttribute("name", fullName);
        console.log(`doWork complete: ${fullName}`);
      } catch (error) {
        console.error("Error", error);
        span.setStatus(SpanStatusCode.ERROR, error);
      } finally {
        span.end();
      }
    });
  }
});
