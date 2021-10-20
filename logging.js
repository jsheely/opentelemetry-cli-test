const version = require("./package.json").version;
const { context, trace } = require("@opentelemetry/api");
const {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} = require("@opentelemetry/tracing");
const { NodeTracerProvider } = require("@opentelemetry/node");

const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

provider.register();
trace.setGlobalTracerProvider(provider);
const tracer = provider.getTracer("test-cli");
const PARENT_SPAN = tracer.startSpan(
  "main",
  {
    attributes: {
      version,
    },
  }
  //   context.active()
);

function shutdown() {
  PARENT_SPAN.end();
}

module.exports = {
  tracer,
  shutdown,
  PARENT_SPAN,
};
