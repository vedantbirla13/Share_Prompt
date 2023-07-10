"use client";

import React, { useEffect, useState } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {
        data.map((post) => (
          <PromptCard 
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        ))
      }
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState([])
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [Posts, setPosts] = useState([])

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i") // i for case-sensitive
    return Posts.filter((item) => 
      regex.test(item.creator.username) ||
      regex.test(item.tag) ||
      regex.test(item.prompt)
    ) 

  }

  const handleSearchChange = async(e) => {
      clearTimeout(searchTimeout)
      setSearchText(e.target.value)

      // Debounce method
      // we have an API that searches a tag or username, and we can't 
      // afford to fire it too often. We want to search only when 
      // we have typed the whole search query.
      setSearchTimeout(
        setTimeout(() => {
          const searchResults = filterPrompts(e.target.value)
          setSearchedResults(searchResults)
        }, 500)
      )
  };

  const handleTagClick = (tagName) => {

    setSearchText(tagName)
    const searchResult = filterPrompts(tagName)
    setSearchedResults(searchResult)
  }

 
  useEffect(() => {
    const fetchPosts = async() => {
      const response = await fetch(`/api/prompt`);
      const data = await response.json()
      setPosts(data)
    }

    fetchPosts()
  }, [])
  

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer tracking-wide"
        />
      </form>

     
          <PromptCardList 
            data={ searchText ? searchedResults : Posts}
            handleTagClick = {handleTagClick}
          />
      
    </section>
  );
};

export default Feed;
