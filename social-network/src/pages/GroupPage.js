import React from 'react'
import "../styles/GroupPage.css"

const GroupPage = (groupNumber) => {
  return (
    <div className='group-container'>
        <h1 className='group-name'>GroupName</h1>
        <div className='group-posts'>
            <div className='group-post'>
                <h2>Post 1</h2>
                <p>Post 1 description</p>
                <h2>Post 2</h2>
                <p>Post 2 description</p>
            </div>
        </div>
        <div className='group-members'>
            <h1 className='group-members-header'>Members</h1>
            <div className='group-members-list'>
                <div className='group-member'>
                    <h2>Member 1</h2>
                    <h2>Member 2</h2>
                    <h3>Member 3</h3>
                </div>
            </div>
        </div>
        <div className='group-join'>
            <button className='join-button'>Join Group</button>
        </div>
        <div className='event-list'>
            <h1 className='event-list-header'>Events</h1>
            <div className='event-list-container'>
                <div className='event'>
                    <h2>Event 1</h2>
                    <p>Event 1 description</p>
                    <h2>Event 2</h2>
                    <p>Event 2 description</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GroupPage