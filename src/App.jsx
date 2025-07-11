import { useState } from "react"

const awardsData = await import("./awardsData.json").then(m => m.awardsData)
const allEntries = Object.entries(awardsData)

export default function AwardGenerator() {
    const [code, setCode] = useState("")
    const [reply, setReply] = useState("")
    const [type, setType] = useState("Course")
    const [name, setName] = useState("")
    const [completionDate, setCompletionDate] = useState("")
    const [updateDate, setUpdateDate] = useState("")
    const [reviewer, setReviewer] = useState("Kiyomi Hashimoto")
    const [customReason, setCustomReason] = useState("")
    const [rawInput, setRawInput] = useState("")

    const normalizeKey = (input) => {
        const stripped = input.replace(/\[|\]|\(|\)|[#]/g, '').split(" ")[0].trim().toLowerCase()
        const match = Object.entries(awardsData).find(([k, v]) =>
            k.toLowerCase() === stripped ||
            v.name.toLowerCase().includes(stripped)
        )
        return match?.[0] || null
    }

    const parseInput = () => {
        const lines = rawInput.split("\n").map(l => l.trim())
        for (let line of lines) {
            if (line.toLowerCase().startsWith("award name:")) {
                setType("Award")
                const val = line.split(":")[1]?.trim() || ""
                const key = normalizeKey(val)
                if (key) setName(key)
            } else if (line.toLowerCase().startsWith("course name:")) {
                setType("Course")
                const val = line.split(":")[1]?.trim() || ""
                const key = normalizeKey(val)
                if (key) setName(key)
            } else if (line.toLowerCase().startsWith("date completed:")) {
                setCompletionDate(line.split(":")[1]?.trim() || "")
            }
        }
    }

    const generate = () => {
        const item = awardsData[name] || {}
        const reason = customReason || item.reason || "Completed the selected entry."
        const hasImage = !!item.image
        const imageLine = hasImage ? `[img]${item.image}[/img]\n` : ""
        const quoteLine = !hasImage ? `[quote]\n${name} - ${completionDate}\n[/quote]` : ""
        const bbcodeBlock = `${imageLine}${quoteLine}`
        const forumReply = `[b]Updated ${updateDate}[/b]\n\n[i]${type} completed[/i]\n[b]${name} - ${completionDate}[/b]\n\n[b]Reason:[/b] ${reason}\n\n[i]Reviewed by: ${reviewer}, Administrative Clerk[/i]`
        setCode(bbcodeBlock)
        setReply(forumReply)
    }

    const filteredEntries = allEntries.filter(([, v]) => v.type === type)

    return (
        <div style={{ display: 'grid', gap: '1rem', maxWidth: 600, margin: 'auto' }}>
            <div>
                <textarea
                    placeholder="Paste request here to auto-fill"
                    value={rawInput}
                    onChange={e => setRawInput(e.target.value)}
                    rows={5}
                    style={{ width: '100%' }}
                />
                <button onClick={parseInput} style={{ marginTop: '0.5rem' }}>Parse Input</button>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
                <select value={type} onChange={e => { setType(e.target.value); setName("") }}>
                    <option value="Course">Course</option>
                    <option value="Award">Award</option>
                    <option value="Qualification">Qualification</option>
                    <option value="Ribbon">Ribbon</option>
                </select>

                <select value={name} onChange={e => setName(e.target.value)} disabled={!type} style={{ display: 'block', marginTop: '0.5rem' }}>
                    <option value="">Select Entry</option>
                    {filteredEntries.map(([key, entry]) => (
                        <option key={key} value={key}>{`${key} - ${entry.name}`}</option>
                    ))}
                </select>

                <input placeholder="Date Completed (e.g. 31/MAR/2025)" value={completionDate} onChange={e => setCompletionDate(e.target.value)} style={{ display: 'block', marginTop: '0.5rem', width: '100%' }} />
                <input placeholder="Update Date (e.g. 06/APR/2025)" value={updateDate} onChange={e => setUpdateDate(e.target.value)} style={{ display: 'block', marginTop: '0.5rem', width: '100%' }} />
                <input placeholder="Reviewer Name" value={reviewer} onChange={e => setReviewer(e.target.value)} style={{ display: 'block', marginTop: '0.5rem', width: '100%' }} />
                <textarea placeholder="Custom Reason (optional)" value={customReason} onChange={e => setCustomReason(e.target.value)} rows={3} style={{ display: 'block', marginTop: '0.5rem', width: '100%' }} />
                <button onClick={generate} style={{ marginTop: '0.5rem' }}>Generate</button>
            </div>

            <div>
                <h3>Forum Reply</h3>
                <textarea value={reply} rows={6} readOnly style={{ width: '100%' }} />
            </div>

            <div>
                <h3>BBCode for Personnel File</h3>
                <textarea value={code} rows={5} readOnly style={{ width: '100%' }} />
            </div>
        </div>
    )
}