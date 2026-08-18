import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// For admin/owner dashboards: all leads across all marketers, plus every
// marketer's profile so leads can be attributed to a name in the UI.
export function useAllLeadsData() {
  const [leads, setLeads] = useState([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      setLoading(true)
      setError('')

      const [leadsResult, profilesResult] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('users_profiles').select('id, full_name, role'),
      ])

      if (!isMounted) return

      if (leadsResult.error) {
        setError(leadsResult.error.message)
      } else {
        setLeads(leadsResult.data)
      }

      if (!profilesResult.error) setProfiles(profilesResult.data)

      setLoading(false)
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  return { leads, profiles, loading, error }
}
