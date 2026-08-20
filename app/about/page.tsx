import Image from "next/image";
import { Star, Heart } from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Isabella Martinez",
      role: "Lead Stylist & Founder",
      image: "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=600&auto=format&fit=crop",
      bio: "With over 15 years of international experience, Isabella brings a touch of Parisian elegance to every cut and color."
    },
    {
      name: "James Chen",
      role: "Master Colorist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      bio: "Specializing in balayage and vivid colors, James transforms hair into a living canvas of beautiful hues."
    },
    {
      name: "Sophia Rossi",
      role: "Esthetician & Spa Specialist",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
      bio: "Sophia's holistic approach to skin care ensures you leave glowing from the inside out."
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=2000&auto=format&fit=crop" 
            alt="Salon Interior" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-foreground mb-6">
            Our <span className="text-primary italic">Story</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            Founded on the principle that everyone deserves to feel extraordinary, 
            The Crown Aesthetics has been redefining beauty standards since 2018.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">More Than Just a Salon</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We believe that true beauty comes from confidence. Our mission is to create a welcoming, 
              luxurious environment where you can relax, be yourself, and let our experts enhance your natural features.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every product we use is ethically sourced and cruelty-free. We are committed to sustainable 
              practices that protect both your hair and our environment.
            </p>
            
            <div className="flex items-center space-x-4 mt-8">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-current" />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">Rated 4.9/5 by 1,000+ clients</span>
            </div>
          </div>
          
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop" 
              alt="Salon Process" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl m-4 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-muted/30 py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Experts</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, idx) => (
              <div key={idx} className="bg-card rounded-2xl overflow-hidden shadow-md border border-border group">
                <div className="h-80 overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <Heart className="w-6 h-6 text-primary cursor-pointer hover:fill-primary" />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-medium uppercase tracking-wider mb-4">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
