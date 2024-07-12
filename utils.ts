async function getJsonFromPostFetch(link: string, data: { [key: string]: string }): Promise<{ [key: string]: string }> {
    const fetchData = await fetch(link, {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return await fetchData.json();
}