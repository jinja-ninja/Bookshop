'use strict'

function onInit() {
    onDisplayLang()
    onFilterByQueryParams()
    renderCategories()
    renderBooks()
}

function renderBooks() {
    const books = getBooksToShow()

    if (getViewBy() === 'table') {

        removeClass('hide', 'books-container')
        addClass('hide', 'cards-container')

        const strHTML = books.map(book =>
            `<tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td><button class="read-book-btn" onclick="onReadBookClick('${book.id}')">Read</button></td>
            <td><button class="update-book-btn" onclick="onUpdateBookClick('${book.id}')">Update</button></td>
            <td><button class="remove-book-btn" onclick="onRemoveBookClick('${book.id}')">Remove</button></td>
        </tr>`
        ).join('')

        setElHtml('books-table-body', strHTML) // How to select tbody inside books-table

    } else {
        removeClass('hide', 'cards-container')
        addClass('hide', 'books-container')

        const strHTML = books.map(book =>
            `<article class="card">
            <h3>${book.title}</h3>
            <h4>${book.price}</h4>
            <h4>${book.id}</h4>
            <div>
                <button class="read-book-btn" onclick="onReadBookClick('${book.id}')">Read</button>
                <button class="update-book-btn" onclick="onUpdateBookClick('${book.id}')">Update</button>
                <button class="remove-book-btn" onclick="onRemoveBookClick('${book.id}')">Remove</button>
            </div>
            </article>
            `).join('')

        setElHtml('cards-container', strHTML)
    }
}

function onSetViewBy(viewBy) {
    setViewBy(viewBy)
    renderBooks()
}

function onSetSortBy() {
    const elSortType = document.querySelector('.select-sort')
    const elIsDescending = document.querySelector('.is-descending')

    const isDesc = elIsDescending.checked ? 1 : -1
    const books = setSortBy(elSortType.value, isDesc)

    renderBooks()
}

function onSetFilterBy(filterBy) {
    var elSearchTerm = document.querySelector('.search-term')
    var elSearchRate = document.querySelector('.filter-rate-range')

    filterBy.title = elSearchTerm.value
    filterBy.minRate = elSearchRate.value
    setFilterBy(filterBy)
    elSearchTerm.value = ''

    const queryParams = `?title=${filterBy.title}&minRate=${filterBy.minRate}&lang=${gCurrLang}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryParams

    window.history.pushState({ path: newUrl }, '', newUrl)

    renderBooks()
}

function onUpdateBookRate(rate) {
    updateBookRate(rate)
}

function onDisplayLang() {
    const queryParams = new URLSearchParams(window.location.search)
    const lang = queryParams.get('lang') || ''

    if (!lang) return

    onSetLang(lang)
    document.querySelector('.select-lang').value = lang
}

function onFilterByQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)
    const filterBy = {
        title: queryParams.get('title') || '',
        minRate: +queryParams.get('minRate') || 0,
    }
    if (!filterBy.title && !filterBy.minRate || !filterBy.lang) return

    document.querySelector('.search-term').value = filterBy.title
    document.querySelector('.filter-rate-range').value = filterBy.minRate
    setFilterBy(filterBy)
}

function onSetLang(lang) {
    if (lang === 'he') document.body.classList.add('RTL')
    else document.body.classList.remove('RTL')
    setLang(lang)
}

function onAddBookClick() {
    const title = prompt('Book Title?')
    const price = +prompt(`What's the new price?`)

    addBook(title, price)
    flashMsg('Book added sucsessfuly')
    renderBooks()
    renderCategories()
}

function onReadBookClick(bookId) {
    const book = getBookById(bookId)
    const elModal = document.querySelector('.modal')

    elModal.querySelector('h6 span').innerText = book.id
    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('h4').innerText = book.price + '$'
    elModal.querySelector('input').value = book.rate

    elModal.querySelector('.book-img').innerHTML = `<img src="img/${book.imgUrl}" class="book-img" alt="Photo of ${book.name}" onerror="this.src='img/default.png'"></img>`

    elModal.classList.add('open')

    setLastOpenedBook(bookId)
}

function onUpdateBookClick(bookId) {
    const price = +prompt(`What's the new price?`)
    updateBookPrice(bookId, price)
    renderBooks()
    renderCategories()
}

function onRemoveBookClick(bookId) {
    removeBook(bookId)
    flashMsg('Book removed sucsessfuly')
    renderBooks()
    renderCategories()
}

function renderCategories() {
    const elFooter = document.querySelector('footer')

    var expensive = getBooksByCategory().expensive ? getBooksByCategory().expensive : 0
    var normal = getBooksByCategory().normal ? getBooksByCategory().normal : 0
    var cheap = getBooksByCategory().cheap ? getBooksByCategory().cheap : 0

    elFooter.innerText = 'Total: ' + expensive + ' Expensive books, ' + normal + ' Normal books, ' + cheap + ' Cheap books'
}

function onNextPage() {
    // Not handeling disabeling the button
    nextPage()
    renderBooks()
}

function onPrevPage() {
    // Not handeling disabeling the button
    prevPage()
    renderBooks()
}

function flashMsg(msg) {
    const elMsg = document.querySelector('.user-notification')

    elMsg.innerText = msg
    elMsg.classList.add('open')
    setTimeout(() => elMsg.classList.remove('open'), 3000)
}

function onCloseModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('open')
}