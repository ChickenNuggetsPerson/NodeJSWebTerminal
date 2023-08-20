const socket = io();

const term = new Terminal();
term.open(document.getElementById('terminal'));

let textBuffer = ""
term.onKey(data => {
    //console.log(data)
    let character = data.key;
    if (data.domEvent.keyCode == 8) { // backspace key
        term.write("\b \b")
        textBuffer = textBuffer.slice(0, -1)
        return
    }
    if (data.domEvent.keyCode == 13) { // enter key
        socket.emit('input', textBuffer + '\n');
        term.write("\n\r")
        textBuffer = ""
        return
    }
    
    term.write(character)
    textBuffer += character
});


socket.on('output', data => {
  term.write(data)
  console.log(data)
});
