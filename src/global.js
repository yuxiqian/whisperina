const {
    console,
    menu,
    utils
} = iina;

menu.addItem(
    menu.item(
        "Recognize what's this...",
        async () => {
            utils.ask("hahahaHAha");
        }
    )
)
utils.ask("What is your name?")
console.log("Plugin is running");
