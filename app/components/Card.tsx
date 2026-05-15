export default function Card(props: {
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
}) {

    // props for titel and description and image url and tags
    const { title, description, imageUrl, tags } = props;

    return (
        <div className="card bg-base-100 shadow-sm">
            <figure>
                <img
                    src={imageUrl}
                    alt={title} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {title}
                </h2>
                <p>{description}</p>
                <div className="card-actions justify-end">
                    {tags.map((tag, index) => (
                        <div key={index} className="badge badge-outline">
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
