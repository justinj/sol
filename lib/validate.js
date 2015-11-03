export default function(spec, schema) {
  var errors = schema.errors(spec);
  if (errors) {
    throw new Error(JSON.stringify(errors));
  }
};
