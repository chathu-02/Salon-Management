import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee-01-utils/marquee";

const reviews = [
  {
    name: "Sophia Vance",
    username: "@sophiavance",
    body: "“The 24K Gold Facial was sheer perfection. My skin felt illuminated and firm for over a week! The VIP ambiance and tea service are unmatched.”",
    profile: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Liam Hemsworth",
    username: "@liam_h",
    body: "“Best haircut experience in Colombo. Unbelievable attention to detail and sharp styling by the master stylist.”",
    profile: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Isabella Mendes",
    username: "@isabellam",
    body: "“The color blending is gorgeous! Zero brassiness, and my hair feels softer than before. I get compliments everywhere I go.”",
    profile: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Charlotte Dubois",
    username: "@charlotted",
    body: "“Pure bliss and rejuvenation. The therapist listened to my pressure preferences and the lavender oils melted all my shoulder tension.”",
    profile: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Elena Rostova",
    username: "@elenar",
    body: "“The cuticle care and hot stone hand massage were exceptional. The gel polish still looks fresh after three weeks!”",
    profile: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Alexander Vance",
    username: "@alexander_v",
    body: "“A truly five-star luxury experience. From the reception welcome to the precision beard trim, everything was flawless.”",
    profile: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
  },
];

const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

const ReviewCard = ({
  profile,
  name,
  username,
  body,
}: {
  profile: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <Card className="relative h-full w-80 cursor-pointer overflow-hidden border-[#B38B4D]/30 bg-[#021a12] shadow-xl p-5 hover:border-[#B38B4D] transition-colors">
      <CardContent className="p-0 flex flex-col gap-2.5">
        <div className="flex flex-row items-center gap-3">
          <img
            className="rounded-full w-10 h-10 object-cover border border-[#B38B4D]"
            alt={name}
            src={profile}
          />
          <div className="flex flex-col">
            <p className="text-sm font-bold text-[#F5F5F0] font-serif">{name}</p>
            <p className="text-xs text-[#B38B4D] font-mono">
              {username}
            </p>
          </div>
        </div>
        <p className="text-xs italic text-white/80 line-clamp-3 leading-relaxed">
          {body}
        </p>
      </CardContent>
    </Card>
  );
};

export default function TestimonialMarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4">
      <Marquee pauseOnHover className="[--duration:25s]">
        {firstRow.map((review, idx) => (
          <ReviewCard key={idx} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:25s]">
        {secondRow.map((review, idx) => (
          <ReviewCard key={idx} {...review} />
        ))}
      </Marquee>
      <div className="from-[#032B1E] pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r"></div>
      <div className="from-[#032B1E] pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l"></div>
    </div>
  );
}
