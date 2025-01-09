function formatToCurrency(values) {
    return Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(values)
}

module.exports = { formatToCurrency }