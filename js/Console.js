class Console {
  static outputError = true;
  static errors = new Array();

  static CONSOLE_LOG = 'CONSOLE_LOG';
  static CONSOLE_ERROR = 'CONSOLE_ERROR';
  static CONSOLE_WARN = 'CONSOLE_WARN';
  
  static log(message, type = Console.CONSOLE_LOG) {
    const preparedMessage = Console.prepareMessage(message);

    switch(type) {
      case Console.CONSOLE_ERROR:
        console.error(preparedMessage);
        break;
      case Console.CONSOLE_WARN:
        console.warn(preparedMessage);
        break;
      default:
        console.log(preparedMessage);
        break;
    }

    Console.errors.push(preparedMessage);
  }

  static prepareMessage(message) {
    return Console.getDateTime() + ": " + message; 
  }

  static getDateTime() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return  date+' '+time;
  }
}
