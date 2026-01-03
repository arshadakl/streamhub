import { ChannelCard } from "./channel-card"
import type { Channel } from "@/lib/types"

interface RelatedChannelsProps {
  channels: Channel[]
  currentChannelId: string
}

export function RelatedChannels({ channels, currentChannelId }: RelatedChannelsProps) {
  const related = channels.filter((ch) => ch.id !== currentChannelId).slice(0, 6)

  if (related.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-foreground mb-6">Similar Channels</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </section>
  )
}
