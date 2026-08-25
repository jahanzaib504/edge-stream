import { useEffect, useState } from "react"
import api from "../api/axios"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { Plus, Trash2, LoaderCircle } from "lucide-react"

const shakeVariants = {
    initial: { x: 0 },
    shake: {
        x: [-8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.4 },
    },
}

const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video")
        video.preload = "metadata"

        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src)
            resolve(video.duration)
        }

        video.onerror = () => {
            URL.revokeObjectURL(video.src)
            reject(new Error("Unable to read video metadata"))
        }

        video.src = URL.createObjectURL(file)
    })
}

const Field = ({
    id,
    type = "text",
    placeholder,
    value,
    handleChange,
    label,
    error = null,
    disabled,
}) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm font-medium text-zinc-300">
                {label}
            </label>

            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className="
                    w-full
                    rounded-xl
                    border border-zinc-700
                    bg-zinc-800
                    px-3.5 py-2.5
                    sm:px-4 sm:py-3
                    text-sm sm:text-base
                    text-zinc-100
                    placeholder:text-zinc-500
                    outline-none
                    transition-all
                    duration-200
                    focus:border-red-500
                    focus:ring-2
                    focus:ring-red-500/20
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            />
            {error && (
                <motion.div initial="initial" animate="shake" variants={shakeVariants}>
                    <div className="text-sm text-red-500">* {error}</div>
                </motion.div>
            )}
        </div>
    )
}

const TextAreaField = ({ id, placeholder, value, handleChange, label, error = null }) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm font-medium text-zinc-300">
                {label}
            </label>
            <textarea
                id={id}
                rows={4}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className="
                    w-full
                    resize-y
                    rounded-xl
                    border border-zinc-700
                    bg-zinc-800
                    px-3.5 py-2.5
                    sm:px-4 sm:py-3
                    text-sm sm:text-base
                    text-zinc-100
                    placeholder:text-zinc-500
                    outline-none
                    transition-all
                    duration-200
                    focus:border-red-500
                    focus:ring-2
                    focus:ring-red-500/20
                "
            />
            {error && (
                <motion.div initial="initial" animate="shake" variants={shakeVariants}>
                    <div className="text-sm text-red-500">* {error}</div>
                </motion.div>
            )}
        </div>
    )
}

const FileUpload = ({ id, setKey, label, error = null, onFileSelected }) => {
    const STATUS = {
        GENERATING_PRESIGNED_URL: "Generating upload URL...",
        UPLOADING_TO_S3: "Uploading...",
        UPLOADED: "Uploaded",
        ERROR: "Upload failed",
    }
    const [status, setStatus] = useState(null)
    const [fileName, setFileName] = useState("")

    const allowedExtensions = id === "poster" ? ".webp,.png,.jpeg,.jpg" : ".mp4"

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return
        setFileName(selectedFile.name)

        if (onFileSelected) {
            try {
                await onFileSelected(selectedFile)
            } catch {
                toast.error("Could not read video duration")
            }
        }

        try {
            const { data } = await api.get("/movie/presigned_url", {
                params: { filename: selectedFile.name, filetype: id },
            })
            const { presigned_url, key, content_type } = data

            setStatus(STATUS.UPLOADING_TO_S3)
            const res = await fetch(presigned_url, {
                method: "PUT",
                body: selectedFile,
                headers: { "Content-Type": content_type },
            })

            if (!res.ok) {
                throw new Error(`S3 upload failed with status ${res.status}`)
            }

            setStatus(STATUS.UPLOADED)
            setKey(key)
        } catch (err) {
            setStatus(STATUS.ERROR)
            toast.error(`Failed to upload ${label.toLowerCase()}`)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm font-medium text-zinc-300">
                {label}
            </label>

            <label
                htmlFor={id}
                className="
                    flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3
                    w-full rounded-xl border border-dashed border-zinc-700
                    bg-zinc-800 px-3.5 py-3 sm:px-4
                    text-sm text-zinc-400 cursor-pointer
                    transition-colors duration-200
                    hover:border-red-500/60 hover:bg-zinc-800/80
                "
            >
                <span className="truncate max-w-full sm:max-w-[60%]">
                    {fileName || `Choose ${label.toLowerCase()}...`}
                </span>

                {status && (
                    <span className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
                        {status !== STATUS.UPLOADED && status !== STATUS.ERROR && (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        )}
                        {status}
                    </span>
                )}

                <input
                    type="file"
                    id={id}
                    onChange={handleFileChange}
                    accept={allowedExtensions}
                    className="hidden"
                />
            </label>

            {error && (
                <motion.div initial="initial" animate="shake" variants={shakeVariants}>
                    <div className="text-sm text-red-500">* {error}</div>
                </motion.div>
            )}
        </div>
    )
}

const Cast = ({ cast, setMovie }) => {
    const [name, setName] = useState("")
    const [error, setError] = useState(null)

    const handleAdd = () => {
        if (!name.trim()) {
            setError("Cast member name is required")
            return
        }

        setMovie((prev) => ({
            ...prev,
            cast: [...(prev.cast || []), name.trim()],
        }))

        setName("")
        setError(null)
    }

    const handleDelete = (index) => {
        setMovie((prev) => ({
            ...prev,
            cast: prev.cast.filter((_, i) => i !== index),
        }))
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAdd()
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-zinc-300">Cast</span>

            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Actor name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="
                        flex-1 rounded-xl border border-zinc-700 bg-zinc-800
                        px-3.5 py-2.5 sm:px-4 sm:py-3
                        text-sm sm:text-base text-zinc-100
                        placeholder:text-zinc-500 outline-none
                        transition-all duration-200
                        focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                    "
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="
                        inline-flex items-center justify-center gap-2
                        rounded-xl bg-red-600 px-4 py-2.5 sm:py-3
                        text-sm sm:text-base font-semibold text-white
                        transition-colors duration-200
                        hover:bg-red-700
                        shrink-0
                    "
                >
                    <Plus className="h-4 w-4" />
                    Add
                </button>
            </div>

            {error && <div className="text-sm text-red-500">* {error}</div>}

            {cast?.length > 0 && (
                <ul className="flex flex-wrap gap-2 mt-1">
                    {cast.map((member, index) => (
                        <li
                            key={`${member}-${index}`}
                            className="
                                flex items-center gap-2
                                rounded-full border border-zinc-800 bg-zinc-800/50
                                pl-3.5 pr-2 py-1.5
                                text-sm text-zinc-100
                            "
                        >
                            {member}
                            <button
                                type="button"
                                onClick={() => handleDelete(index)}
                                className="
                                    rounded-full p-1 text-zinc-400
                                    transition-colors duration-200
                                    hover:bg-red-500/10 hover:text-red-400
                                "
                                aria-label={`Remove ${member}`}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

const AdminMoviePage = () => {
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [genres, setGenres] = useState([])
    const [errors, setErrors] = useState({})

    const [movie, setMovie] = useState({
        title: "",
        description: "",
        genre_ids: [],
        cast: [],
        duration: 0, // seconds
        video_url: null,
        poster_url: null,
    })

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const { data } = await api.get("/movie/genres")
                setGenres(data)
            } catch (e) {
                toast.error("Failed to fetch genres")
            } finally {
                setLoading(false)
            }
        }
        fetchGenres()
    }, [])

    const handleChange = (field) => (e) => {
        setMovie((prev) => ({ ...prev, [field]: e.target.value }))
    }

    const handleVideoSelected = async (file) => {
        const seconds = await getVideoDuration(file)
        setMovie((prev) => ({ ...prev, duration: Math.round(seconds) }))
    }

    const toggleGenre = (genreId) => {
        setMovie((prev) => {
            const exists = prev.genre_ids.includes(genreId)
            return {
                ...prev,
                genre_ids: exists
                    ? prev.genre_ids.filter((g) => g !== genreId)
                    : [...prev.genre_ids, genreId],
            }
        })
    }

    const setVideoKey = (key) => setMovie((prev) => ({ ...prev, video_url: key }))
    const setPosterKey = (key) => setMovie((prev) => ({ ...prev, poster_url: key }))

    const validate = () => {
        const nextErrors = {}
        if (!movie.title.trim()) nextErrors.title = "Title is required"
        if (!movie.description.trim()) nextErrors.description = "Description is required"
        if (movie.genre_ids.length === 0) nextErrors.genre_ids = "Select at least one genre"
        if (!movie.duration || movie.duration <= 0) nextErrors.duration = "Upload a video to calculate duration"
        if (!movie.poster_url) nextErrors.poster = "Poster upload is required"
        if (!movie.video_url) nextErrors.video = "Video upload is required"
        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        try {
            setSubmitting(true)
            await api.post("/movie/m/", movie)
            toast.success("Movie created successfully")
            setMovie({
                title: "",
                description: "",
                genre_ids: [],
                cast: [],
                duration: 0,
                video_url: null,
                poster_url: null,
            })
            setErrors({})
        } catch (e) {
            toast.error("Failed to create movie")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading)
        return (
            <div className="flex min-h-[40vh] items-center justify-center text-zinc-400">
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                Loading ....
            </div>
        )

    return (
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8 shadow-xl mt-6 mb-10">
                <h1 className="mb-6 sm:mb-8 text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-100">
                    Add Movie
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                        <Field
                            id="title"
                            label="Title"
                            placeholder="e.g. Inception"
                            value={movie.title}
                            handleChange={handleChange("title")}
                            error={errors.title}
                        />
                        <Field
                            id="duration"
                            type="number"
                            label="Duration (minutes)"
                            value={movie.duration ? (movie.duration / 60).toFixed(1) : ""}
                            error={errors.duration}
                            disabled={true}
                        />
                    </div>

                    <TextAreaField
                        id="description"
                        label="Description"
                        placeholder="A short synopsis of the movie..."
                        value={movie.description}
                        handleChange={handleChange("description")}
                        error={errors.description}
                    />

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-zinc-300">Genres</span>
                        <div className="flex flex-wrap gap-2">
                            {genres.map((genre) => {
                                const active = movie.genre_ids.includes(genre.id)
                                return (
                                    <button
                                        type="button"
                                        key={genre.id}
                                        onClick={() => toggleGenre(genre.id)}
                                        className={`
                                            rounded-full border px-3.5 py-1.5 text-xs sm:text-sm
                                            transition-colors duration-200
                                            ${active
                                                ? "border-red-500 bg-red-500/10 text-red-400"
                                                : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
                                            }
                                        `}
                                    >
                                        {genre.name}
                                    </button>
                                )
                            })}
                        </div>
                        {errors.genre_ids && (
                            <motion.div initial="initial" animate="shake" variants={shakeVariants}>
                                <div className="text-sm text-red-500">* {errors.genre_ids}</div>
                            </motion.div>
                        )}
                    </div>

                    <Cast cast={movie.cast} setMovie={setMovie} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                        <FileUpload
                            id="poster"
                            label="Poster"
                            setKey={setPosterKey}
                            error={errors.poster}
                        />
                        <FileUpload
                            id="video"
                            label="Video"
                            setKey={setVideoKey}
                            error={errors.video}
                            onFileSelected={handleVideoSelected}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="
                            w-full sm:w-auto
                            inline-flex items-center justify-center gap-2
                            rounded-xl bg-red-600 px-6 py-2.5 sm:py-3
                            text-sm sm:text-base font-semibold text-white
                            transition-colors duration-200
                            hover:bg-red-700
                            disabled:cursor-not-allowed disabled:opacity-60
                        "
                    >
                        {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {submitting ? "Saving..." : "Save Movie"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AdminMoviePage