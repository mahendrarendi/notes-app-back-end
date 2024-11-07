const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        id,
        title,
        tags,
        body,
        createdAt,
        updatedAt,
    };

    notes.push(newNote);

    // check if notes successuffly added
    const isSuccess = notes.filter((note) => note.id === id).length > 0;
    console.log(isSuccess);

    if (isSuccess) {
        return h
            .response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    noteId: id,
                },
            })
            .code(201);
    }
    return h
        .response({
            status: 'fail',
            message: 'Catatan gagal ditambahkan',
        })
        .code(500);
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const note = notes.filter((n) => n.id === id)[0];
    // [0] bearti notes pertama yang ditemukan, kalo bae id duplokat
    console.log(note);

    if (note !== undefined) {
        return h
            .response({
                status: 'success',
                data: {
                    note,
                },
            })
            .code(200);
    }
    return h
        .response({
            status: 'fail',
            message: 'Catatan tidak ditemukan',
        })
        .code(404);
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title: title || notes[index].title,
            tags: tags || notes[index].tags,
            body: body || notes[index].body,
            updatedAt,
        };

        return h
            .response({
                status: 'success',
                message: 'Catatan berhasil diperbarui',
            })
            .code(200);
    }

    return h
        .response({
            status: 'fail',
            message: 'Gagal memperbarui catatan. Id tidak ditemukan',
        })
        .code(404);
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        // splice(index, 1) berarti menghapus 1 element dari array
        // dari index yang ditemukan

        return h
            .response({
                status: 'success',
                message: 'Catatan berhasil dihapus',
            })
            .code(200);
    }

    return h
        .response({
            status: 'fail',
            message: 'Catatan gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
};

module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};