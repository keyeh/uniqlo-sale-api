export default {
    trim: function (value) {
        return typeof value === 'string' ? value.trim().replace(/\\n/g, '%7C') : value
    },
    extractThumbnailUrl: function (value) {
        if (typeof value !== 'string') {
            return value
        }
        const obj = JSON.parse(value)
        return obj.src.replace('?$prod$', '')
    },
    extractVariantName: function (value) {
        if (typeof value !== 'string') {
            return value
        }
        const obj = JSON.parse(value)
        return obj.title.split(',')[1].trim()
    },
    ajaxifyVariantUrl: function (value) {
        if (typeof value !== 'string') {
            return value
        }
        return value + '&format=ajax';
    },
    formatPaginationUrl: function (value) {
        if (typeof value !== 'string') {
            return value
        }
        console.log(value.replace(/\|/g, '%7C'))
        return value.replace(/\|/g, '%7C')
    },
    extractStock: function (value) {
        const OOS = ' - OUT OF STOCK -'
        if (typeof value !== 'string') {
            return value
        }
        if (value === 'Select Size') {
            return undefined
        }
        if (value.includes(OOS)) {
            return {
                size: value.replace(OOS, ''),
                inStock: false
            }
        }
        return {
            size: value,
            inStock: true
        }
    }
}