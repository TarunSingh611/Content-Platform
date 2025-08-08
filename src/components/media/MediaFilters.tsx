'use client'

import { useState } from 'react'
import { Search, Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface MediaFiltersProps {
  onFilterChange: (filters: {
    type: string
    search: string
    view: 'grid' | 'list'
  }) => void
  totalFiles: number
}

export default function MediaFilters({ onFilterChange, totalFiles }: MediaFiltersProps) {
  const [type, setType] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const handleTypeChange = (newType: string) => {
    setType(newType)
    onFilterChange({ type: newType, search, view })
  }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    onFilterChange({ type, search: newSearch, view })
  }

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView)
    onFilterChange({ type, search, view: newView })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search media files..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewChange('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewChange('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-600">
        {totalFiles} file{totalFiles !== 1 ? 's' : ''} found
        {type !== 'all' && ` in ${type}s`}
        {search && ` matching "${search}"`}
      </div>
    </div>
  )
}