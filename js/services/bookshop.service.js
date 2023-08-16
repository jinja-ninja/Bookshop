'user strict'

const STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 2

var gUsers
var gLastOpenBook
var gViewBy = 'table'

var gPageIdx = 0
var gFilterBy = { title: '', minRate: 0 }

_createBooks()

function getBooksToShow() {
    var books = gBooks.filter(book => book.title.includes(gFilterBy.title) && (book.rate >= gFilterBy.minRate))
    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function getViewBy() {
    return gViewBy
}

function getBooksByCategory() {
    const booksMap = gBooks.reduce((map, book) => {
        if (!map[book.category]) map[book.category] = 0
        map[book.category]++
        return map
    }, {})

    return booksMap
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) gPageIdx--

}

function prevPage() {
    gPageIdx--
    if (gPageIdx * PAGE_SIZE < 0) gPageIdx++
}

function setFilterBy(filterBy = {}) {
    if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate // When can it be undefined?
    return gFilterBy
}

function setSortBy(sortBy, isDescending) {
    if (sortBy === 'title') gBooks.sort((book1, book2) => book2.title.localeCompare(book1.title) * isDescending) // How to do with minuses?
    if (sortBy === 'price') gBooks.sort((book1, book2) => (book2.price - book1.price) * isDescending)
}

function addBook(title, price) {
    const book = _createBook(title, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
}

function updateBookPrice(bookId, price) {
    const book = getBookById(bookId)
    book.price = price
    _saveBooksToStorage()
}

function updateBookRate(rate) {
    const LastOpenedBook = _loadLastOpenedBook()
    const bookIdx = gBooks.findIndex(book => book.id === LastOpenedBook.id)
    gBooks[bookIdx].rate = rate

    _saveBooksToStorage()
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = [
            _createBook('Wallabala - The original guide', getRandomInt(10, 31)),
            _createBook('All you need to know about insurance', getRandomInt(10, 31)),
            _createBook('About time and investments', getRandomInt(10, 31))
        ]
    }
    gBooks = books
    _saveBooksToStorage()
}

function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId)
}

function _createBook(title, price) {
    return {
        id: makeId(),
        title,
        price,
        rate: getRandomInt(1, 11),
        category: checkCategory(price),
        imgUrl: null
    }
}

function setLastOpenedBook(bookId) {
    gLastOpenBook = getBookById(bookId)
    _saveLastOpenedBook(gLastOpenBook)
}

function setViewBy(viewBy) {
    gViewBy = viewBy
    _saveViewByToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function _saveViewByToStorage() {
    saveToStorage('viewBy', gViewBy)
}

function _saveLastOpenedBook(book) {
    saveToStorage('LastOpenedBook', book)
}

function _loadLastOpenedBook() {
    return loadFromStorage('LastOpenedBook')
}

function _loadViewBy() {
    loadFromStorage('viewBy')
}

function checkCategory(price) {
    if (price > 20) return 'expensive'
    if (price > 10) return 'normal'
    else return 'cheap'
}