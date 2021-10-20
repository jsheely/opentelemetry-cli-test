const { trace } = require("@opentelemetry/api");
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

function shutdown(span) {
  span.end();
}

module.exports = {
  tracer,
  shutdown,
};
