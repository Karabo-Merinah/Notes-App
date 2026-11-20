// define the colours used throughout the app
export const colors = {
    primary: "#FFCC00",
    background: "#FFFFFF",
    text: "#111111",
    secondaryText: "#777777",
    border: "#222222",
    pink: "#FF6678",
    blue: "#48A8FF",
    green: "#32D878",
    yellow: "#FFCC00",
    purple:"#d8bfd8"
}

// store the colours that can be assigned to categories
export const categoryColors = [
    colors.pink,
    colors.blue,
    colors.green,
    colors.yellow
]

// assign a consistent colour based on the category name
export const getCategoryColor = (category: string) => {
    // calculate a number for the category
    let number = 0
    // remove extra spaces and convert the category name to lowercase
    const name = category.trim().toLowerCase()
    // go through each character in the category name
    for (let i = 0; i < name.length; i++) {
        // convert each character into a number and add it to the total
        number += name.charCodeAt(i)
    }
    // use the remainder to select a colour from the array
    return categoryColors[number % categoryColors.length]
}
