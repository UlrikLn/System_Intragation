console.log(new Date()); // UTC   :  Standard: ISO 8601

console.log(Date()); // Local Date Time 

console.log(Date.now()); // Unix epoch  :  Seconds since 1970

console.log(new Date().toLocaleDateString()); // Ikke helt korrekt da danmark bruger vi .

const date = new Date();

const danishDate = new Intl.DateTimeFormat('da-DK').format(date);
console.log(danishDate);

const americanDate = new Intl.DateTimeFormat('en-US').format(date);
console.log(americanDate);