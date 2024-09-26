 async function ha() {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ip = data.ip;
console.log(ip);
 }
 ha()