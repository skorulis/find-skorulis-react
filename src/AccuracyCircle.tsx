import * as React from "react";

export const AccuracyCircle: React.FC<google.maps.CircleOptions> = (options) => {
    const [circle, setCircle] = React.useState<google.maps.Circle>();
  
    React.useEffect(() => {
      if (!circle) {
        setCircle(new google.maps.Circle());
      }
  
      // remove marker from map on unmount
      return () => {
        if (circle) {
            circle.setMap(null);
        }
      };
    }, [circle]);
  
    React.useEffect(() => {
      if (circle) {
        circle.setOptions(options);
      }
    }, [circle, options]);
  
    return null;
  };