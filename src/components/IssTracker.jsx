import { useIssData } from '../hooks/useIssData';
import IssMap from '../charts/IssMap';
import IssSpeedChart from '../charts/IssSpeedChart';
import { RefreshCw, MapPin, Gauge, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function IssTracker() {
  const { issPositions, astronauts, loading, locationName, currentSpeed, refetch, isTracking, toggleTracking } = useIssData();

  const currentPos = issPositions.length > 0 ? issPositions[issPositions.length - 1] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">ISS Live Tracking</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTracking}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${isTracking ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {isTracking ? 'Live: ON' : 'Live: OFF'}
          </button>
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Location</p>
              <h3 className="text-xl font-bold line-clamp-1" title={locationName}>{locationName}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Speed</p>
              <h3 className="text-xl font-bold">{Math.round(currentSpeed).toLocaleString()} km/h</h3>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full text-green-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">People in Space</p>
              <h3 className="text-xl font-bold">{astronauts.length}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-full text-orange-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <h3 className="text-xl font-bold">
                {currentPos ? format(new Date(currentPos.timestamp * 1000), 'HH:mm:ss') : '--:--:--'}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-card border rounded-lg shadow-sm p-2">
          <IssMap positions={issPositions} />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <IssSpeedChart positions={issPositions} />
        </div>
      </div>
    </div>
  );
}
