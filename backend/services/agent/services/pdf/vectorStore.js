import path from "path"
import * as lancedb from "@lancedb/lancedb"


const DB_PATH =
    process.env.LANCEDB_PATH ||
    path.resolve(
        "./lancedb-data"
    )


// IMPORTANT:
//
// Old PDF Chat used Ollama embeddings.
// Gemini embeddings have different dimensions.
//
// Therefore use a NEW table name.
//
// Do NOT use old document_chunks table.

const TABLE_NAME =
    "nexus_pdf_chunks_v2"


let dbPromise = null



const getDb = () => {

    if (!dbPromise) {

        dbPromise =
            lancedb.connect(
                DB_PATH
            )

    }


    return dbPromise
}



// ================================
// ADD CHUNKS
// ================================

export const addChunks =
async (
    docId,
    chunks
) => {

    if (
        !chunks ||
        chunks.length === 0
    ) {

        throw new Error(
            "No chunks available for LanceDB"
        )

    }


    const rows =
        chunks.map(
            chunk => ({

                id:
                    `${docId}_${chunk.index}`,

                docId:
                    String(docId),

                chunkIndex:
                    chunk.index,

                text:
                    chunk.text,

                vector:
                    chunk.embedding

            })
        )


    const invalidVector =
        rows.find(
            row =>
                !Array.isArray(
                    row.vector
                ) ||
                row.vector.length === 0
        )


    if (invalidVector) {

        throw new Error(
            `Empty embedding found for chunk ${invalidVector.chunkIndex}`
        )

    }


    console.log(
        "LanceDB vectors:",
        rows.length
    )


    console.log(
        "Vector dimensions:",
        rows[0].vector.length
    )


    const db =
        await getDb()


    const tableNames =
        await db.tableNames()


    if (
        !tableNames.includes(
            TABLE_NAME
        )
    ) {

        await db.createTable(
            TABLE_NAME,
            rows
        )


        console.log(
            "Created LanceDB table:",
            TABLE_NAME
        )

    } else {

        const table =
            await db.openTable(
                TABLE_NAME
            )


        await table.add(
            rows
        )

    }

}



// ================================
// SEARCH CHUNKS
// ================================

export const searchChunks =
async (
    docId,
    queryEmbedding,
    topK = 8
) => {

    const db =
        await getDb()


    const tableNames =
        await db.tableNames()


    if (
        !tableNames.includes(
            TABLE_NAME
        )
    ) {

        return []

    }


    const table =
        await db.openTable(
            TABLE_NAME
        )


    const results =
        await table

            .vectorSearch(
                queryEmbedding
            )

            .where(
                `docId = '${String(docId)}'`
            )

            .limit(
                topK
            )

            .toArray()


    return results.map(
        result => ({

            index:
                result.chunkIndex,

            text:
                result.text

        })
    )
}



// ================================
// DELETE PDF VECTORS
// ================================

export const deleteDocumentVectors =
async (docId) => {

    try {

        const db =
            await getDb()


        const tableNames =
            await db.tableNames()


        if (
            !tableNames.includes(
                TABLE_NAME
            )
        ) {

            return

        }


        const table =
            await db.openTable(
                TABLE_NAME
            )


        await table.delete(
            `docId = '${String(docId)}'`
        )


    } catch (error) {

        console.log(
            "Vector cleanup error:",
            error.message
        )

    }

}