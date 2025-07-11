import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select"

import { awardsData } from "./awardsDataFull"

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
        <div className="grid gap-4">
            <Card>
                <CardContent className="grid gap-2 p-4">
                    <Textarea
                        placeholder="Paste request here to auto-fill"
                        value={rawInput}
                        onChange={e => setRawInput(e.target.value)}
                    />
                    <Button onClick={parseInput}>Parse Input</Button>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="grid gap-2 p-4">
                    <Select value={type} onValueChange={value => {
                        setType(value)
                        setName("")
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Course">Course</SelectItem>
                            <SelectItem value="Award">Award</SelectItem>
                            <SelectItem value="Qualification">Qualification</SelectItem>
                            <SelectItem value="Ribbon">Ribbon</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={name} onValueChange={setName} disabled={!type}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Entry" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredEntries.map(([key, entry]) => (
                                <SelectItem key={key} value={key}>{`${key} - ${entry.name}`}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input placeholder="Date Completed (e.g. 31/MAR/2025)" value={completionDate} onChange={e => setCompletionDate(e.target.value)} />
                    <Input placeholder="Update Date (e.g. 06/APR/2025)" value={updateDate} onChange={e => setUpdateDate(e.target.value)} />
                    <Input placeholder="Reviewer Name" value={reviewer} onChange={e => setReviewer(e.target.value)} />
                    <Textarea placeholder="Custom Reason (optional)" value={customReason} onChange={e => setCustomReason(e.target.value)} />
                    <Button onClick={generate}>Generate</Button>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <h3 className="font-bold mb-2">Forum Reply</h3>
                    <Textarea value={reply} rows={7} readOnly />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <h3 className="font-bold mb-2">BBCode for Personnel File</h3>
                    <Textarea value={code} rows={6} readOnly />
                </CardContent>
            </Card>
        </div>
    )
}
