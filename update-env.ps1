$value = 'mongodb+srv://moodmart:pass123m@cluster0.qablwfr.mongodb.net/MoodMart?retryWrites=true&w=majority'
$confirm = 'y'
$input = $value + "`n" + $confirm + "`n"
$input | npx --yes vercel env update MONGO_URI production