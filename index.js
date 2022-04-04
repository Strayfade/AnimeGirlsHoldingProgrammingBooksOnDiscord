const DiscordJS = require('discord.js')
const dotenv = require('dotenv')
const rp = require('request-promise')
const Client = new DiscordJS.Client({
    intents: [
        DiscordJS.Intents.FLAGS.GUILDS,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGES
    ]
})
dotenv.config();

var LanguageKeywords = [
    
]
function CheckMessageContainsKeyword(Message, Keywords) {
    for (var i = 0; i < Keywords.length; i++) {
        var Msg = Message.toString().toLowerCase();
        if (Msg.toString().includes(Keywords[i].toLowerCase()))
            return Keywords[i];
    }
    return false;
}

Client.on('ready', () => {
    console.log('Logged in!')
})
Client.on('messageCreate', (message) => {
    var Lang = CheckMessageContainsKeyword(message, LanguageKeywords);
    if (Lang && message.author.id != Client.user.id) {
        var ImageURI = "https://api.github.com/repos/cat-milk/Anime-Girls-Holding-Programming-Books/contents/" + Lang
        var RequestOptions = {
            uri: ImageURI,
            headers: {
                'User-Agent': 'Request-Promise',
                'Authorization': 'token ' + process.env.GITHUBKEY
            },
        };
        rp(RequestOptions)
        .then(function(html) {
            var Results = JSON.parse(html);
            var Selection = Math.floor(Math.random() * Results.length) - 1;
            console.log(Results[Selection].path)
            message.channel.send("https://raw.githubusercontent.com/cat-milk/Anime-Girls-Holding-Programming-Books/master/" + Results[Selection].path)
        })
    }
})
Client.login(process.env.TOKEN)

var StartURL = "https://api.github.com/repos/cat-milk/Anime-Girls-Holding-Programming-Books/git/trees/master?recursive=1"
var options = {
    uri: StartURL,
    headers: {
        'User-Agent': 'Request-Promise',
        'Authorization': 'token ' + process.env.GITHUBKEY
    },
};
rp(options)
.then(function(html) {
    var tree = JSON.parse(html).tree;
    for (var x = 0; x < tree.length; x++) {
        if (tree[x].path.toString().includes("/")) {
            var Lang = tree[x].path.toString().split("/")[0];
            if (!LanguageKeywords.includes(Lang) && Lang.length > 1)
                LanguageKeywords.push(Lang)
        }
    }
    LanguageKeywords.sort(function(a, b){
        // ASC  -> a.length - b.length
        // DESC -> b.length - a.length
        return b.length - a.length;
      });
    console.log(LanguageKeywords)
})