async function test() {
    try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(' error message:', error.message);
        console.log('Fetch error:', error);
    }
}

export default test;
