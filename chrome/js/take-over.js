//code to inject into webpage
//select random element based on what is on the page
console.log('VSEEKSBOX: entered take-over script...');
var elements = document.getElementsByTagName('p');
for(var i = 0; i < elements.length; i++) {
    elements[i].innerHTML = "THIS PAGE HAS BEEN HIJACKED."
}
//depending on element, change the HTML makeup to make it stand out to the user.