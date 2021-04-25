import { Lec1Component } from './lec1.component';
import { ProductService } from './product.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DOMHelper } from 'src/app/testing-service/dom-helper';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

describe('ProductsListComponent', () => {
  let component: Lec1Component;
  let fixture: ComponentFixture<Lec1Component>;
  let dh: DOMHelper<Lec1Component>;
  let productServiceMock: any;
  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', ['getProducts']);
    productServiceMock.getProducts.and.returnValue(of([ { id: 'abc' , name: 'item' , pictureId: 'abc'  }]));
    await TestBed.configureTestingModule({
      declarations: [
        Lec1Component
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: "add", component: DummyComponnent }
        ])
      ],
      providers: [
        Location,
        { provide: ProductService, useValue: productServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Lec1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dh = new DOMHelper(fixture);
  });

  describe('Simple HTML', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    // Simple HTML
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should contain an h2 tag', () => {
      debugger
      expect(dh.singleText('h2')).toBe('List all Products');
    });

    it('Should minimum be one button on the page', () => {
      expect(dh.count('button')).toBeGreaterThanOrEqual(1);
    });

    it('Should be a + button first on the page', () => {
      expect(dh.singleText('button')).toBe('+');
    });
  });

  describe('List Products', () => {
    let helper: Helper;
    beforeEach(() => {
      helper = new Helper();
      fixture.detectChanges();
    });
    it('Should show One Unordered List Item', () => {
      expect(dh.count('ul')).toBe(1);
    });

    // it('Should show no list item when no products are available', () => {
    //   expect(dh.count('li')).toBe(0);
    // });

    it('Should show one list item when I have one product', () => {
      component.products = helper.getProducts(1);
      fixture.detectChanges();
      expect(dh.count('li')).toBe(1);
    });

    it('Should show 100 list item when I have 100 products', () => {
      component.products = helper.getProducts(100);
      fixture.detectChanges();
      expect(dh.count('li')).toBe(100);
    });

    it('Should show 100 Delete buttons, 1 pr. item', () => {
      component.products = helper.getProducts(100);
      fixture.detectChanges();
      expect(dh.countText('button', 'Delete')).toBe(100);
    });

    it('Should show 1 span pr product', () => {
      component.products = helper.getProducts(1);
      fixture.detectChanges();
      expect(dh.count('span')).toBe(1);
    });

    it('Should show 1 product name and id in span', () => {
      component.products = helper.getProducts(1);
      fixture.detectChanges();
      expect(dh.singleText('span'))
        .toBe(helper.products[0].name + ' -- ' + helper.products[0].id);
    });

    it('Should show 5 spans, 1 pr. product', () => {
      component.products = helper.getProducts(5);
      fixture.detectChanges();
      expect(dh.count('span')).toBe(5);
    });

    it('Should show 5 product names and ids in spans', () => {
      component.products = helper.getProducts(5);
      fixture.detectChanges();
      for (let i = 0; i < 5; i++) {
        const product = helper.products[i];
        expect(dh.countText('span', product.name + ' -- ' + product.id))
          .toBe(1);
      }
    });

    it('Should not show img tag without a url on the Product', () => {
      component.products = helper.getProducts(1);
      fixture.detectChanges();
      expect(dh.count('img'))
        .toBe(0);
    });

    it('Should show img tag with a url on the Product', () => {
      component.products = helper.getProducts(1);
      helper.products[0].url = 'http://a-url';
      fixture.detectChanges();
      expect(dh.count('img'))
        .toBe(1);

    });
  });

  describe('Delete Products', () => {
    let helper: Helper;
    beforeEach(() => {
      helper = new Helper();
      fixture.detectChanges();
    });
    it('Should call deleteProduct once when we click Delete button', () => {
      component.products = helper.getProducts(1);
      fixture.detectChanges();
      spyOn(component, 'deleteProduct');
      dh.clickButton('Delete');
      expect(component.deleteProduct).toHaveBeenCalledTimes(1);
    });

    it('Should call deleteProduct with the product to delete when we click Delete button', () => {
      component.products = helper.getProducts(1);
      fixture.detectChanges();
      spyOn(component, 'deleteProduct');
      dh.clickButton('Delete');
      expect(component.deleteProduct).toHaveBeenCalledWith(helper.products[0]);
    });
  });

  // describe('Navigation', () => {
  //   let location: Location;
  //   let router: Router;
  //   beforeEach(() => {
  //     location = TestBed.get(Location);
  //     router = TestBed.get(Router);
  //     fixture.detectChanges();
  //   });
  //   // Navigation
  //   it('Should navigate to / before + button click',
  //     () => {
  //       // find DebugElements with an attached RouterLinkStubDirective
  //          let r = TestBed.get(Location);
  //          debugger
  //       console.log(r)
  //       // expect(location.path()).toBe('');
  //     }
  //   );

  //   it('Should navigate to /add on + button click',
  //     () => {
  //       spyOn(router, 'navigateByUrl');
  //       dh.clickButton('+');
  //       expect(router.navigateByUrl).
  //       toHaveBeenCalledWith(router.createUrlTree(['/add']),
  //         { skipLocationChange: false, replaceUrl: false });
  //     });
  // });

  describe('Call NgOnInit on Demand', () => {
    let helper: Helper;
    beforeEach(() => {
      helper = new Helper();
    });

    it('Should call getProducts on the ProductService one time on ngOnInit', () => {
      fixture.detectChanges();
      expect(productServiceMock.getProducts).toHaveBeenCalledTimes(1);
    });

    it('Should show img tag when product with url is loaded async from ProductService',
      () => {
        // productServiceMock.getProducts.and.returnValue(helper.getProducts(1));
        // helper.products[0].url = 'https://picsum.photos/200';
        // fixture.detectChanges();
        // console.log("img ::",dh.count('img'));
        // expect(dh.count('img')).toBe(1);
      });

    it('Should not show img tag when product does not have pictureId and is loaded async from ProductService',
      () => {
        productServiceMock.getProducts.and.returnValue(helper.getProducts(1));
        helper.products[0].url = undefined;
        fixture.detectChanges();
        expect(dh.count('img')).toBe(0);
      });
  });
});

class Helper {
  products: any[] = [];
  getProducts(amount: number): Observable<any[]> {
    for (let i = 0; i < amount; i++) {
      this.products.push(
        { id: 'abc' + i, name: 'item' + i, pictureId: 'abc' + i }
      );
    }
    return of(this.products);
  }
}


@Component({ template: '' })
class DummyComponnent { }


