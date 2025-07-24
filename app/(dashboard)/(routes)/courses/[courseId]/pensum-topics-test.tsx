import { useEffect, useState } from "react";

export default function PensumTopicsTest({ courseId }: { courseId: string }) {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/courses/${courseId}/pensum-topics`)
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(err => setError("Error al cargar temas"));
  }, [courseId]);

  if (error) return <div>{error}</div>;
  if (!topics.length) return <div>No hay temas de pensum publicados.</div>;

  return (
    <div>
      <h2>Temas de Pensum Publicados</h2>
      <ul>
        {topics.map((topic: any) => (
          <li key={topic.id}>{topic.title} ({topic.chapters?.length || 0} capítulos)</li>
        ))}
      </ul>
    </div>
  );
}
