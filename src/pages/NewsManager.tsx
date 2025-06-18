import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type NewsItem = {
  id: number;
  title: string;
  content: string;
  image: string | null;
  tags: string[];
};

const NewsManager: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [currentNews, setCurrentNews] = useState<Partial<NewsItem>>({ tags: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newTag, setNewTag] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const image = acceptedFiles[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentNews(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(image);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentNews(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNews.title || !currentNews.content) return;

    if (isEditing && currentNews.id !== undefined) {
      setNewsList(prev =>
        prev.map(news => (news.id === currentNews.id ? { ...news, ...currentNews } : news))
      );
      setIsEditing(false);
    } else {
      const newNews: NewsItem = {
        id: Date.now(),
        title: currentNews.title!,
        content: currentNews.content!,
        image: currentNews.image || null,
        tags: currentNews.tags || [],
      };
      setNewsList(prev => [...prev, newNews]);
    }

    setCurrentNews({ tags: [] });
    setNewTag('');
    setShowForm(false);
  };

  const handleEdit = (news: NewsItem) => {
    setCurrentNews(news);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setNewsList(prev => prev.filter(news => news.id !== id));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentNews({ tags: [] });
    setNewTag('');
    setShowForm(false);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !(currentNews.tags || []).includes(newTag.trim())) {
      setCurrentNews(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setCurrentNews(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
          <h1 className="text-4xl font-extrabold mb-2">News Dashboard</h1>
          <p className="text-blue-200 text-lg">Manage your latest news and updates</p>
        </div>

        {!showForm && (
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setCurrentNews({ tags: [] });
                setIsEditing(false);
                setShowForm(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-all duration-200 mb-10"
            >
              + Create New Article
            </button>
          </div>
        )}

        {showForm && (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {isEditing ? 'Edit News Article' : 'Create New Article'}
            </h2>
            <form onSubmit={handleAddOrUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Article Title</label>
                <input
                  name="title"
                  type="text"
                  value={currentNews.title || ''}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                <textarea
                  name="content"
                  value={currentNews.content || ''}
                  onChange={handleInputChange}
                  rows={6}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Write your news content here..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Image</label>
                <div
                  {...getRootProps()}
                  className={`p-6 border-2 ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                  } border-dashed rounded-lg text-center cursor-pointer`}
                >
                  <input {...getInputProps()} />
                  {currentNews.image ? (
                    <p className="text-blue-600">Image selected! Drag a new one or click to change.</p>
                  ) : (
                    <p className="text-gray-600">Drag 'n' drop an image here, or click to select one</p>
                  )}
                </div>
                {currentNews.image && (
                  <div className="mt-4 text-center">
                    <img
                      src={currentNews.image}
                      alt="Preview"
                      className="max-w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(currentNews.tags || []).map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-white hover:text-red-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newTag}
                    onChange={handleTagChange}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg"
                    placeholder="Add a new tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-r-lg"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  {isEditing ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="p-8 bg-gray-50 border-t">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Published Articles</h3>
          {newsList.length === 0 ? (
            <p className="text-center text-gray-500">No articles published yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {newsList.map(news => (
                <div key={news.id} className="bg-white p-6 rounded-xl shadow-md border">
                  {news.image && (
                    <img src={news.image} alt={news.title} className="mb-4 w-full h-48 object-cover rounded" />
                  )}
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{news.title}</h4>
                  <p className="text-gray-700 mb-4 whitespace-pre-line">{news.content}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {news.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => handleEdit(news)} className="px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(news.id)} className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsManager;
