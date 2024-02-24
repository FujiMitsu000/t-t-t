export const setPages = (totalCounter, limit) => {
    return getPagesArray(getPageCount(totalCounter, limit));
}

export const getPageCount = (totalCounter, limit) => {
    return Math.ceil(totalCounter / limit);
}

export const getPagesArray = (totalPages) => {
    let result = [];
    for (let i = 0; i < totalPages; i++) {
        result.push(i + 1);
    }

    return result;
}