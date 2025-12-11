import Table from "./Table"
import Form from "./Form"

import {useState, useEffect} from 'react'

function LinkContainer(){
    
const [favLinks, setFavLinks] = useState([])

// Fetch links from server on component mount
useEffect(() => {
    fetchLinks()
}, [])

const fetchLinks = async () => {
    try {
        const response = await fetch('/links')
        const data = await response.json()
        setFavLinks(data)
    } catch (error) {
        console.error('Error fetching links:', error)
    }
}

const handleSubmit = async (newLink) => {
    try {
        const response = await fetch('/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newLink)
        })
        
        if (response.ok) {
            const createdLink = await response.json()
            setFavLinks([...favLinks, createdLink])
        } else {
            console.error('Failed to create link')
        }
    } catch (error) {
        console.error('Error creating link:', error)
    }
}

const handleRemove = async (index) => {
    const linkToDelete = favLinks[index]
    if (!linkToDelete || !linkToDelete.id) {
        console.error('Link or ID not found')
        return
    }
    
    try {
        const response = await fetch(`/links/${linkToDelete.id}`, {
            method: 'DELETE'
        })
        
        if (response.ok) {
            // Refetch links from server to ensure consistency
            await fetchLinks()
        } else {
            const errorData = await response.json().catch(() => ({}))
            console.error('Failed to delete link:', errorData)
        }
    } catch (error) {
        console.error('Error deleting link:', error)
    }
}

    return(
        <div>
          <h1> My Favorite Links</h1>
          <p> Add a new link with a name and URL to the table!</p>
        <Table linkData={favLinks} removeLink={handleRemove} /> 
        <h1> Add new</h1>
        <Form onNewLink = {handleSubmit} />

        </div>
    )
}

export default LinkContainer