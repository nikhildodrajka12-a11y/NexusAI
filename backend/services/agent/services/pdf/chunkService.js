export const chunkText = (
    text,
    chunkSize = 1200,
    overlap = 150
) => {

    const cleaned =
        text
            .replace(/\s+/g, " ")
            .trim()


    const chunks = []

    let start = 0
    let index = 0


    while (start < cleaned.length) {

        const end =
            Math.min(
                start + chunkSize,
                cleaned.length
            )


        chunks.push({

            index,

            text:
                cleaned.slice(
                    start,
                    end
                )

        })


        index++


        if (
            end === cleaned.length
        ) {

            break

        }


        start =
            end - overlap

    }


    return chunks
}



// Used for large PDF summarization
export const groupChunks = (
    chunks,
    numberOfGroups = 6
) => {

    if (!chunks.length) {
        return []
    }


    const size =
        Math.ceil(
            chunks.length /
            numberOfGroups
        )


    const groups = []


    for (
        let i = 0;
        i < chunks.length;
        i += size
    ) {

        groups.push(
            chunks.slice(
                i,
                i + size
            )
        )

    }


    return groups
}