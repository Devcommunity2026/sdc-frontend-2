import React, { useEffect, useState } from "react";
import axios from "axios";

import Loader from "../components/Loader";
import EventCard from "../components/ui/EventCard";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Paginator from '../components/ui/Paginator'
import { fetchEvents } from "../controllers/detailsRequest";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;


  useEffect(() => {
    fetchEvents({ page, limit, setLoading, setEvents, setTotalPages, });
  }, [page]);

  return (
    <Layout>
      <Header
        heading1={"Events Hosted by the"}
        heading2={"Developers Community"}
        subtext={"Get a glimpse of all our past milestones and upcoming technical sessions  Find an event that inspires you and register to secure your spot today!"}
      />

      {loading ? (
        <div className="w-full flex items-center justify-center py-12">
          <Loader label="Loading Events..." />
        </div>
      ) : events.length > 0 ? (
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard
              key={event._id}
              event={{
                ...event,
                image: event.thumbnail || event.image,
              }}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex items-center justify-center py-12">
          <p className="text-gray-400">No Events Found</p>
        </div>
      )}

      {totalPages > 1 && (
        <Paginator page={page} setPage={setPage} totalPages={totalPages} />
      )}
    </Layout>
  );

};

export default Events;