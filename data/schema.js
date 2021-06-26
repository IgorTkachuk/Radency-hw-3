let yup = require("yup");
const { parse, isDate } = require("date-fns");

function parseDateString(value, originalValue) {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, "dd.MM.yyyy", new Date());

  return parsedDate;
}

let schema = yup.object().shape({
  name: yup.string().required(),
  created: yup.date().transform(parseDateString).required(),
  category: yup.string().required(),
  content: yup.string().required(),
  _id: yup.number().required().positive().integer().required(),
  _archived: yup.boolean().required(),
});

module.exports = schema;
