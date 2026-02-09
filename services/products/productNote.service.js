const ProductNoteRepository = require('../../repositories/products/productNote.repository');

class ProductNoteService {
    async getNote() {
        return await ProductNoteRepository.findByProduct();
    }

    async createNotes(notes, productId, transaction) {
        if (!notes || notes.length === 0) return [];

        const notesPayload = notes.map(n => ({
            product_id: productId,
            note: n.note
        }));
        return await ProductNoteRepository.createNotes(notesPayload, transaction);
    }

    async getNotesByProduct(productId) {
        return await ProductNoteRepository.findByProduct(productId);
    }

    async replaceNotesByProduct(notes, productId, transaction) {
        if (!productId || notes.length) return;

        await ProductNoteRepository.deleteByProduct(productId, transaction);

        const notesPayload = notes.map(n => ({
            product_id: productId,
            note: n.note
        }));

        return await ProductNoteRepository.deleteByProduct(notesPayload, transaction);
    }
    
}

module.exports = new ProductNoteService();